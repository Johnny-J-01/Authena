import { db } from "../config/db.js";
import { AuditLogEventType, type AuditLog } from "@prisma/client";

export interface CreateAuditLogInput {
    userId?: number | null | undefined;
    event: AuditLogEventType;
    ip: string;
    userAgent?: string | null | undefined;
}

export const createAuditLogRecord = async (data: CreateAuditLogInput): Promise<AuditLog> => {
    return db.auditLog.create({
        data: {
            userId: data.userId ?? null,
            event: data.event,
            ip: data.ip,
            userAgent: data.userAgent ?? null,
        },
    });
};

export const findAuditLogsByUserId = async (userId: number, limit: number = 20): Promise<AuditLog[]> => {
    return db.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
};

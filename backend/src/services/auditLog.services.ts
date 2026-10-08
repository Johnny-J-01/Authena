import { AuditLogEventType } from "@prisma/client";
import { createAuditLogRecord, type CreateAuditLogInput } from "../repositories/auditLog.repositories.js";

const CRITICAL_SECURITY_EVENTS: AuditLogEventType[] = [
    AuditLogEventType.TOKEN_REUSE_DETECTED,
    AuditLogEventType.ACCOUNT_LOCKED,
];

export const logAuditEvent = async (input: CreateAuditLogInput): Promise<void> => {
    try {
        if (CRITICAL_SECURITY_EVENTS.includes(input.event)) {
            console.error(
                `🚨 [SECURITY ALERT] Event: ${input.event} | UserID: ${input.userId ?? "Unknown"} | IP: ${input.ip} | UserAgent: ${input.userAgent ?? "N/A"}`
            );
        } else {
            console.log(
                `ℹ️ [AUDIT LOG] Event: ${input.event} | UserID: ${input.userId ?? "Anonymous"} | IP: ${input.ip}`
            );
        }

        await createAuditLogRecord(input);
    } catch (error) {
        console.error("Failed to persist audit log entry:", error);
    }
};

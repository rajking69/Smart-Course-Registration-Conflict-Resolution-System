"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.AdvisingSessionStatus = void 0;
var AdvisingSessionStatus;
(function (AdvisingSessionStatus) {
    AdvisingSessionStatus["SCHEDULED"] = "scheduled";
    AdvisingSessionStatus["COMPLETED"] = "completed";
    AdvisingSessionStatus["CANCELLED"] = "cancelled";
})(AdvisingSessionStatus || (exports.AdvisingSessionStatus = AdvisingSessionStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["REGISTRATION"] = "registration";
    NotificationType["WAITLIST"] = "waitlist";
    NotificationType["ADVISING"] = "advising";
    NotificationType["SYSTEM"] = "system";
})(NotificationType || (exports.NotificationType = NotificationType = {}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Test route to trigger Sentry error
router.get('/error', (req, res) => {
    throw new Error('🧪 Sentry test error - if you see this in Sentry, it works!');
});
exports.default = router;

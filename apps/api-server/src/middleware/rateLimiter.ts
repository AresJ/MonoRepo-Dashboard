import RateLimit from "express-rate-limit";

export const apiRateLimiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute (for testing)
    max: 5, // Limit each IP to 5 requests per minute (for testing)
    message: {
        success: false,
        message: "Rate limit exceeded. Too many requests, please try again later.",
        retryAfter: "1 minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Too many requests, please try again later.",
            retryAfter: "1 minute"
        });
    }
});

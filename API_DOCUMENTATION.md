# ZedHustle API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.zedhustle.zm/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+260971234567",
  "location": {
    "city": "Lusaka",
    "province": "Lusaka"
  },
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### POST /auth/logout
Logout user and invalidate tokens.

### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

## User Management Endpoints

### GET /users/profile
Get current user profile (Protected).

### PUT /users/profile
Update user profile (Protected).

**Request Body:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+260971234567",
    "location": {
      "city": "Lusaka",
      "province": "Lusaka"
    }
  },
  "preferences": {
    "notifications": {
      "email": true,
      "sms": true
    },
    "language": "en",
    "theme": "light"
  }
}
```

### POST /users/upload-avatar
Upload user avatar (Protected).

### POST /users/kyc/upload
Upload KYC documents (Protected).

**Request Body (multipart/form-data):**
```
document: File
type: "nrc" | "passport" | "utility_bill"
```

## Job Platform Endpoints

### GET /jobs
Get all job listings with optional filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Job category
- `location`: Job location
- `type`: Job type (full-time, part-time, freelance, contract)
- `salary_min`: Minimum salary
- `salary_max`: Maximum salary
- `search`: Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Software Developer",
        "company": "Tech Company",
        "location": "Lusaka",
        "type": "full-time",
        "salary": {
          "min": 5000,
          "max": 8000,
          "currency": "ZMW",
          "period": "monthly"
        },
        "datePosted": "2024-01-01T00:00:00.000Z",
        "deadline": "2024-02-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### POST /jobs
Create new job posting (Protected - Employer role).

**Request Body:**
```json
{
  "title": "Software Developer",
  "description": "Job description...",
  "company": "Tech Company",
  "location": "Lusaka",
  "type": "full-time",
  "category": "technology",
  "salary": {
    "min": 5000,
    "max": 8000,
    "currency": "ZMW",
    "period": "monthly"
  },
  "requirements": ["Bachelor's degree", "3+ years experience"],
  "benefits": ["Health insurance", "Flexible hours"],
  "contactInfo": {
    "email": "hr@company.com",
    "phone": "+260971234567"
  },
  "deadline": "2024-02-01T00:00:00.000Z"
}
```

### GET /jobs/:id
Get specific job details.

### PUT /jobs/:id
Update job posting (Protected - Owner only).

### DELETE /jobs/:id
Delete job posting (Protected - Owner only).

### POST /jobs/:id/apply
Apply for a job (Protected).

**Request Body:**
```json
{
  "coverLetter": "Cover letter text...",
  "resume": "resume_file_url"
}
```

### GET /jobs/my-applications
Get user's job applications (Protected).

### GET /jobs/my-postings
Get employer's job postings (Protected - Employer role).

## Trading Platform Endpoints

### GET /trading/market-data
Get real-time market data.

**Query Parameters:**
- `symbols`: Comma-separated list of symbols (e.g., "USDZM,EURZM,GOLD")
- `type`: Market type (forex, stocks, commodities)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "USDZM",
      "name": "USD/ZMW",
      "type": "forex",
      "price": 25.50,
      "change": 0.25,
      "changePercent": 0.99,
      "volume": 1000000,
      "high": 25.75,
      "low": 25.20,
      "open": 25.25,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /trading/portfolios
Get user's trading portfolios (Protected).

### POST /trading/portfolios
Create new trading portfolio (Protected).

**Request Body:**
```json
{
  "name": "My Portfolio",
  "description": "Portfolio description",
  "initialBalance": 100000
}
```

### GET /trading/portfolios/:id
Get specific portfolio details (Protected).

### POST /trading/trade
Execute a virtual trade (Protected).

**Request Body:**
```json
{
  "portfolioId": "portfolio_id",
  "symbol": "USDZM",
  "type": "buy",
  "quantity": 1000,
  "orderType": "market",
  "stopLoss": 25.00,
  "takeProfit": 26.00
}
```

### GET /trading/history
Get trading history (Protected).

### GET /trading/positions
Get current positions (Protected).

### POST /trading/positions/:id/close
Close a trading position (Protected).

## Investment Platform Endpoints

### GET /investments
Get investment opportunities.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `category`: Investment category
- `location`: Business location
- `min_amount`: Minimum investment amount
- `risk_level`: Risk level (low, medium, high)
- `status`: Investment status

**Response:**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "investment_id",
        "businessName": "Green Farm Co.",
        "description": "Sustainable agriculture business...",
        "category": "agriculture",
        "location": {
          "city": "Kitwe",
          "province": "Copperbelt"
        },
        "funding": {
          "goal": 50000,
          "current": 25000,
          "minimum": 1000,
          "currency": "ZMW"
        },
        "returns": {
          "expected": 15,
          "timeline": "12 months",
          "type": "fixed"
        },
        "riskLevel": "medium",
        "images": ["image1.jpg", "image2.jpg"],
        "status": "active",
        "deadline": "2024-06-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### POST /investments
Create investment opportunity (Protected - Business Owner role).

**Request Body:**
```json
{
  "businessName": "Green Farm Co.",
  "description": "Sustainable agriculture business...",
  "category": "agriculture",
  "location": {
    "city": "Kitwe",
    "province": "Copperbelt",
    "address": "Plot 123, Industrial Area"
  },
  "funding": {
    "goal": 50000,
    "minimum": 1000
  },
  "returns": {
    "expected": 15,
    "timeline": "12 months",
    "type": "fixed"
  },
  "riskLevel": "medium",
  "deadline": "2024-06-01T00:00:00.000Z"
}
```

### GET /investments/:id
Get specific investment details.

### POST /investments/:id/invest
Make an investment (Protected).

**Request Body:**
```json
{
  "amount": 5000,
  "paymentMethod": "wallet"
}
```

### GET /investments/my-investments
Get user's investments (Protected).

### GET /investments/my-opportunities
Get business owner's investment opportunities (Protected).

### POST /investments/:id/update
Post investment update (Protected - Owner only).

**Request Body:**
```json
{
  "title": "Monthly Update",
  "content": "Progress update...",
  "attachments": ["file1.pdf"]
}
```

## Payment System Endpoints

### GET /payments/wallet
Get wallet balance and details (Protected).

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 15000.50,
    "currency": "ZMW",
    "accountNumber": "ZH123456789",
    "status": "active"
  }
}
```

### POST /payments/deposit
Initiate deposit to wallet (Protected).

**Request Body:**
```json
{
  "amount": 1000,
  "paymentMethod": "airtel_money",
  "phoneNumber": "+260971234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "transaction_id",
    "reference": "ZH123456789",
    "status": "pending",
    "paymentUrl": "https://payment.provider.com/pay/123",
    "instructions": "Complete payment using your Airtel Money PIN"
  }
}
```

### POST /payments/withdraw
Initiate withdrawal from wallet (Protected).

**Request Body:**
```json
{
  "amount": 500,
  "paymentMethod": "mtn_money",
  "phoneNumber": "+260971234567"
}
```

### GET /payments/transactions
Get transaction history (Protected).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `type`: Transaction type
- `status`: Transaction status
- `from_date`: Start date
- `to_date`: End date

### POST /payments/verify
Verify payment status (Protected).

**Request Body:**
```json
{
  "transactionId": "transaction_id",
  "reference": "external_reference"
}
```

### POST /payments/webhook/airtel
Airtel Money webhook endpoint.

### POST /payments/webhook/mtn
MTN Mobile Money webhook endpoint.

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics (Protected - Admin role).

### GET /admin/users
Get all users with filters (Protected - Admin role).

### PUT /admin/users/:id/status
Update user status (Protected - Admin role).

### GET /admin/transactions
Get all transactions (Protected - Admin role).

### GET /admin/investments
Get all investments for review (Protected - Admin role).

### PUT /admin/investments/:id/approve
Approve investment opportunity (Protected - Admin role).

### GET /admin/jobs
Get all job postings (Protected - Admin role).

### PUT /admin/jobs/:id/feature
Feature a job posting (Protected - Admin role).

## Notification Endpoints

### GET /notifications
Get user notifications (Protected).

### PUT /notifications/:id/read
Mark notification as read (Protected).

### PUT /notifications/read-all
Mark all notifications as read (Protected).

### POST /notifications/preferences
Update notification preferences (Protected).

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Insufficient permissions |
| USER_001 | User not found |
| USER_002 | Email already exists |
| JOB_001 | Job not found |
| JOB_002 | Application already submitted |
| TRADE_001 | Insufficient virtual balance |
| TRADE_002 | Invalid trading symbol |
| INV_001 | Investment not found |
| INV_002 | Minimum investment not met |
| PAY_001 | Insufficient wallet balance |
| PAY_002 | Payment method not supported |
| PAY_003 | Transaction failed |
| VALID_001 | Validation error |
| SERVER_001 | Internal server error |

## Rate Limits

| Endpoint Category | Limit |
|------------------|-------|
| Authentication | 5 requests/minute |
| General API | 100 requests/minute |
| Trading | 200 requests/minute |
| Payments | 50 requests/minute |
| File Uploads | 10 requests/minute |

## Webhooks

### Payment Webhooks
Payment providers will send webhook notifications to update transaction status.

**Webhook Payload Example:**
```json
{
  "event": "payment.completed",
  "data": {
    "transactionId": "external_transaction_id",
    "reference": "ZH123456789",
    "amount": 1000,
    "currency": "ZMW",
    "status": "completed",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Notification Webhooks
Real-time notifications for important events.

**Events:**
- `job.application.received`
- `investment.funded`
- `trade.executed`
- `payment.completed`
- `kyc.approved`

This API documentation provides comprehensive coverage of all ZedHustle platform endpoints with detailed request/response examples and error handling.
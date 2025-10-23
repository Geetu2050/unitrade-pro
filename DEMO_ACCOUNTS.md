# Demo Accounts for UniTrade Pro

The following demo accounts are pre-created and ready to use for testing the application:

## Available Demo Accounts

| Email | Username | Password | Description |
|-------|----------|----------|-------------|
| demo@unitrade.com | demo_trader | password | Main demo account with trading data |
| john@example.com | john_doe | password | Standard user account |
| jane@example.com | jane_smith | password | Standard user account |
| crypto@example.com | crypto_enthusiast | password | Crypto-focused trader account |

## How to Use

1. **Start the development servers:**
   ```bash
   npm run dev:full
   ```

2. **Open the application:**
   - Frontend: http://localhost:3000 (or the port shown in terminal)
   - API: http://localhost:5000

3. **Login with any demo account:**
   - Go to the login page
   - Use any of the email/password combinations above
   - All accounts use the password: `password`

## Features Available

- **Dashboard**: View portfolio overview and market data
- **Trading**: Execute buy/sell orders for various assets
- **History**: View transaction history
- **Wallet**: Check current holdings and portfolio value
- **Settings**: Manage account preferences

## Notes

- All demo accounts start with a clean slate (no existing transactions)
- Market data is simulated and updates in real-time
- Transactions are stored in memory and will reset when the server restarts
- This is perfect for testing and demonstration purposes

## Troubleshooting

If you encounter any issues:
1. Make sure both servers are running (frontend and API)
2. Check the console for any error messages
3. Try refreshing the page
4. Restart the development servers if needed

# Ticket Marketplace Frontend

This is the frontend application for the Ticket Marketplace, built with Next.js 15 and React 19. The application uses modern web3 technologies and provides a seamless user experience for ticket trading.

## Tech Stack

- **Framework**: Next.js 15.3.1
- **UI Library**: React 19
- **Authentication**: Privy
- **Web3 Integration**: 
  - ethers.js
  - wagmi
  - viem
  - permissionless
- **UI Components**: 
  - Radix UI
  - Tailwind CSS
  - Lucide React
- **Analytics**: PostHog
- **Storage**: Pinata (IPFS)

## Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn or npm package manager
- Git

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd ticket-marketplace-base2.0/retix-fe
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the necessary environment variables (refer to `.env.example` if available).

4. Run the development server:
```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint to check code quality

## Project Structure

- `/src` - Source code directory
- `/public` - Static assets
- `/components` - Reusable React components
- `/app` - Next.js app directory (pages and layouts)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Add license information here]

## Support

For support, please [add support contact information]

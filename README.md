# 💰 Expense Manager

A comprehensive expense tracking application built with React and TypeScript. Track your monthly expenses, categorize them, and get detailed insights into your spending habits.

## ✨ Features

### Core Functionality
- **Add Expenses**: Quickly add new expenses with title, amount, category, date, payment method, and optional description
- **Edit Expenses**: Update any existing expense with a simple click
- **Delete Expenses**: Remove expenses with confirmation
- **Monthly Filtering**: View expenses by month with an intuitive month selector
- **Local Storage**: All data is saved locally in your browser - no backend required!

### Categories
Pre-defined expense categories with icons:
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 💡 Bills & Utilities
- 🎬 Entertainment
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 📦 Other

### Payment Methods
Track how you pay:
- Cash
- Credit Card
- Debit Card
- UPI
- Bank Transfer
- Other

### Analytics & Insights
- **Total Expenses**: See your total spending for the selected month
- **Average Expense**: Calculate average per transaction
- **Highest Expense**: Identify your biggest expense
- **Top Category**: See which category you spend most on
- **Category Breakdown**: Visual breakdown with percentages and progress bars
- **Payment Method Breakdown**: See how you're paying for expenses

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd expense-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown (usually `http://localhost:5173`)

## 📁 Project Structure

```
expense-manager/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.tsx      # Form to add/edit expenses
│   │   ├── ExpenseList.tsx       # List of all expenses
│   │   └── ExpenseSummary.tsx    # Statistics and analytics
│   ├── types/
│   │   └── expense.ts           # TypeScript interfaces and constants
│   ├── utils/
│   │   └── storage.ts            # Local storage utilities
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Local Storage API** - Data persistence

## 💡 Usage

1. **Adding an Expense**:
   - Fill in the expense form at the top
   - Enter title, amount, select category, date, and payment method
   - Optionally add a description
   - Click "Add Expense"

2. **Editing an Expense**:
   - Click the edit icon (pencil) next to any expense
   - Modify the fields in the form
   - Click "Update Expense"

3. **Deleting an Expense**:
   - Click the delete icon (trash) next to any expense
   - Confirm the deletion

4. **Viewing Monthly Expenses**:
   - Use the month selector dropdown to filter expenses by month
   - View statistics and breakdowns for the selected month

## 🎨 Features in Detail

### Expense Form
- Required fields: Title, Amount, Category, Date, Payment Method
- Optional field: Description
- Form validation ensures data integrity
- Auto-reset after adding new expense

### Expense List
- Displays all expenses for the selected month
- Shows category icon, title, amount, date, payment method
- Includes description if provided
- Sorted by date (newest first)
- Edit and delete actions for each expense

### Expense Summary
- **Total Expenses Card**: Shows total amount and transaction count
- **Average Expense Card**: Calculates average per transaction
- **Highest Expense Card**: Displays the largest expense
- **Top Category Card**: Shows the category with highest spending
- **Category Breakdown**: Visual progress bars showing spending by category
- **Payment Method Breakdown**: Grid showing spending by payment method

## 🔒 Data Storage

All expense data is stored locally in your browser using the Local Storage API. This means:
- ✅ No account required
- ✅ Data stays on your device
- ✅ Works offline
- ⚠️ Data is browser-specific (clearing browser data will remove expenses)

## 📱 Responsive Design

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## 📝 Future Enhancements

Potential features for future versions:
- Export expenses to CSV/Excel
- Budget setting and tracking
- Recurring expenses
- Expense search and filtering
- Charts and graphs
- Multiple currency support
- Dark mode
- Data export/import

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

This project is open source and available for personal use.

---

**Happy Expense Tracking! 💰**

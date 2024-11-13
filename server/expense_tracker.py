import json
import os
import argparse
from datetime import datetime
# server/expense_tracker.py
from flask import Blueprint, jsonify, request

expense_tracker_bp = Blueprint('expense_tracker', __name__)
# JSON dosyasının yolu

DATA_FILE = 'expenses.json'

# Expense (Harcamalar) verilerini okuma veya başlatma
def load_expenses():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    return []

# Expense verilerini JSON dosyasına kaydetme
def save_expenses(expenses):
    with open(DATA_FILE, 'w') as file:
        json.dump(expenses, file, indent=4)



# Harcama ekleme
@expense_tracker_bp.route('/add-expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')
    add_to_json(description,amount,category)
    last_data = load_expenses()
    # Burada harcama ekleme işlemi yapılır
    return jsonify({"message": "Expense added", "data": last_data}), 201

def add_to_json(description, amount, category):
    expenses = load_expenses()
    expense_id = len(expenses) + 1
    expense = {
        'id': expense_id,
        'description': description,
        'amount': amount,
        'category': category,
        'date': datetime.now().isoformat()
    }
    expenses.append(expense)
    save_expenses(expenses)

# Harcamaları listeleme
@expense_tracker_bp.route('/list-expenses', methods=['GET'])
def list_expenses():
    expenses = load_expenses()
    # Harcamaları listeleyen işlev (örneğin bir JSON dosyasından okuma)
    return jsonify({"expenses": expenses}), 200

# Harcama güncelleme
def update_expense(expense_id, description, amount, category):
    expenses = load_expenses()
    for expense in expenses:
        if expense['id'] == expense_id:
            expense['description'] = description
            expense['amount'] = amount
            expense['category'] = category
            expense['date'] = datetime.now().isoformat()
            save_expenses(expenses)
            print(f"Expense updated: {description} | ${amount} | Category: {category}")
            return
    print(f"Error: Expense with ID {expense_id} not found.")

# Harcama silme
def delete_expense(expense_id):
    expenses = load_expenses()
    expenses = [expense for expense in expenses if expense['id'] != expense_id]
    save_expenses(expenses)
    print(f"Expense with ID {expense_id} has been deleted.")

# Tüm harcamaları görüntüleme
def view_expenses():
    expenses = load_expenses()
    if not expenses:
        print("No expenses recorded.")
        return
    for expense in expenses:
        print(f"{expense['id']}. {expense['description']} | ${expense['amount']} | Category: {expense['category']} | Date: {expense['date']}")

# Kategoriye göre harcamaları filtreleme
def view_by_category(category):
    expenses = load_expenses()
    filtered_expenses = [expense for expense in expenses if expense['category'].lower() == category.lower()]
    if not filtered_expenses:
        print(f"No expenses found for category: {category}")
        return
    for expense in filtered_expenses:
        print(f"{expense['id']}. {expense['description']} | ${expense['amount']} | Category: {expense['category']} | Date: {expense['date']}")

# Özet: Tüm harcamaların toplamını görüntüleme
def summary_expenses():
    expenses = load_expenses()
    total = sum(expense['amount'] for expense in expenses)
    print(f"Total Expenses: ${total}")

# Aylık harcamaların özeti
def summary_by_month(month):
    expenses = load_expenses()
    total = 0
    for expense in expenses:
        expense_month = datetime.fromisoformat(expense['date']).month
        if expense_month == month:
            total += expense['amount']
    print(f"Total Expenses for month {month}: ${total}")

# Harcama CSV'ye aktarma
def export_to_csv():
    import csv
    expenses = load_expenses()
    with open('expenses.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['ID', 'Description', 'Amount', 'Category', 'Date'])
        for expense in expenses:
            writer.writerow([expense['id'], expense['description'], expense['amount'], expense['category'], expense['date']])
    print("Expenses exported to expenses.csv.")

# Bütçe uyarısı
def budget_alert(budget):
    expenses = load_expenses()
    total = sum(expense['amount'] for expense in expenses)
    if total > budget:
        print(f"Warning: You have exceeded your monthly budget of ${budget}. Total expenses: ${total}.")
    else:
        print(f"Your total expenses are ${total}. You are within your budget of ${budget}.")

# Ana fonksiyon
def main():
    parser = argparse.ArgumentParser(description="Expense Tracker")
    parser.add_argument('action', choices=['add', 'update', 'delete', 'view', 'summary', 'summary_month', 'export', 'budget'], help="Action to perform")
    parser.add_argument('--description', help="Description of the expense")
    parser.add_argument('--amount', type=float, help="Amount of the expense")
    parser.add_argument('--category', help="Category of the expense")
    parser.add_argument('--id', type=int, help="ID of the expense to update or delete")
    parser.add_argument('--month', type=int, help="Month for summary (1-12)")
    parser.add_argument('--budget', type=float, help="Monthly budget")

    args = parser.parse_args()

    if args.action == 'add':
        if not args.description or args.amount is None or not args.category:
            print("Error: Please provide description, amount, and category for the expense.")
            return
        add_expense(args.description, args.amount, args.category)
    
    elif args.action == 'update':
        if not args.id or not args.description or args.amount is None or not args.category:
            print("Error: Please provide ID, description, amount, and category to update the expense.")
            return
        update_expense(args.id, args.description, args.amount, args.category)

    elif args.action == 'delete':
        if not args.id:
            print("Error: Please provide ID to delete the expense.")
            return
        delete_expense(args.id)
    
    elif args.action == 'view':
        view_expenses()

    elif args.action == 'summary':
        summary_expenses()
    
    elif args.action == 'summary_month':
        if not args.month:
            print("Error: Please provide a month number (1-12) for the summary.")
            return
        summary_by_month(args.month)

    elif args.action == 'export':
        export_to_csv()

    elif args.action == 'budget':
        if not args.budget:
            print("Error: Please provide a budget amount.")
            return
        budget_alert(args.budget)

if __name__ == '__main__':
    main()

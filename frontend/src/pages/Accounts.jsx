import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('/api/accounts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Failed to load accounts:', res.status, errorText);
          throw new Error(`Failed to load accounts: ${res.status} ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched accounts:', data);
        setAccounts(data);
      })
      .catch(err => {
        console.error('Error fetching accounts:', err);
      });
  }, []);

  const handleAddAccount = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Account',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Account Name">` +
        `<input id="swal-input2" type="number" class="swal2-input" placeholder="Initial Amount">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const amount = document.getElementById('swal-input2').value;
        if (!name || !amount) {
          Swal.showValidationMessage('Please enter both name and amount');
          return;
        }
        return { name, amount };
      }
    });

    if (formValues) {
      try {
        const res = await fetch('/api/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: formValues.name,
            income_total: Number(formValues.amount),
            expense_total: 0,
            remainder: Number(formValues.amount)
          })
        });

        if (!res.ok) {
          const errorText = await res.json();
          console.error('Failed to create account:', res.status);
          throw new Error(`Failed to create account: ${res.status}`);
        }

        const newAccount = await res.json();
        console.log('Created new account:', newAccount);

        setAccounts(prev => [...prev, newAccount]);

        Swal.fire('Success', 'Account created!', 'success');
      } catch (error) {
        console.error('Error creating account:', error);
        Swal.fire('Error', 'Failed to create account', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Accounts Page</h2>

      <div className="w-full max-w-6xl bg-white rounded shadow-md p-8 flex space-x-6">
        
        <div className="flex-shrink-0">
          <button
            onClick={handleAddAccount}
            className="py-2 px-6 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Add New Account
          </button>
        </div>

        <div className="flex-grow">
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-center">No accounts found.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {accounts.map(account => (
                <div key={account._id} className="p-4 border rounded shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                  <p className="text-sm text-gray-600">Income: ${account.income_total}</p>
                  <p className="text-sm text-gray-600">Expenses: ${account.expense_total}</p>
                  <p className="text-sm font-bold text-green-700">Remainder: ${account.remainder}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Accounts;

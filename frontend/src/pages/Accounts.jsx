import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch accounts on load if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/api/accounts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then(setAccounts)
      .catch(err => {
        console.error('Failed to fetch accounts:', err);
        Swal.fire('Error', 'Could not fetch accounts', 'error');
      });
  }, [isAuthenticated, token]);

  const handleAddAccount = async () => {
    const { value: name } = await Swal.fire({
      title: 'New Account Name',
      input: 'text',
      inputPlaceholder: 'e.g. Savings Account',
      showCancelButton: true,
      confirmButtonText: 'Create',
      inputValidator: value => (!value ? 'Name required' : null)
    });

    if (!name) return;

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error(await res.text());

      const newAccount = await res.json();
      setAccounts(prev => [...prev, newAccount]);
      Swal.fire('Success', 'Account added!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to create account', 'error');
    }
  };

  const handleEditAccount = async (account) => {
    const { value: name } = await Swal.fire({
      title: 'Edit Account Name',
      input: 'text',
      inputValue: account.name,
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValidator: value => (!value ? 'Name required' : null)
    });

    if (!name) return;

    try {
      const res = await fetch(`/api/accounts/${account._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setAccounts(prev =>
        prev.map(a => (a._id === updated._id ? updated : a))
      );
      Swal.fire('Success', 'Account updated!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update account', 'error');
    }
  };

  const handleDeleteAccount = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this account?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      setAccounts(prev => prev.filter(acc => acc._id !== id));
      Swal.fire('Deleted!', 'Account removed.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to delete account', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Accounts</h2>

      <div className="w-full max-w-6xl flex space-x-6">

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
            <p className="text-gray-500 text-center">No accounts yet.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {accounts.map(account => (
                <div key={account._id} className="p-4 border rounded shadow-sm relative">
                  <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                  <p className="text-sm text-gray-600">Income: ${account.income_total || 0}</p>
                  <p className="text-sm text-gray-600">Expenses: ${account.expense_total || 0}</p>
                  <p className="text-sm font-bold text-green-700">Remainder: ${account.remainder || 0}</p>

                  {/* Edit & Delete buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete"
                    >
                      ✖
                    </button>
                  </div>
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

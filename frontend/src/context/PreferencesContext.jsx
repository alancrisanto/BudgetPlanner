import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
    const [currencySymbol, setCurrencySymbol] = useState('$');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchPreferences = async () => {
        if (!user?.token) return;
        try {
            const res = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCurrencySymbol(res.data.preferences?.currencySymbol || '$');
        } catch {
            console.log('Could not load user preferences');
        }
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <PreferencesContext.Provider value={{ currencySymbol, setCurrencySymbol, fetchPreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => useContext(PreferencesContext);

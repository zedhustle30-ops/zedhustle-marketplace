// Example Supabase usage (add to your components)

// Authentication
import { supabase } from './supabase';

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  console.log(data, error);
};

const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log(data, error);
};

// Fetching data
const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data);
};

// Inserting data
const createUser = async (userData) => {
  const { data, error } = await supabase.from('users').insert([userData]);
  console.log(data, error);
};

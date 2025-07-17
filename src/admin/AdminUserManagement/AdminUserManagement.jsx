import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../utils/firebase';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff', departmentId: '' });
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);

        // Fetch departments
        const deptSnapshot = await getDocs(collection(db, 'departments'));
        const deptList = deptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDepartments(deptList);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const dept = departments.find(d => d.id === newUser.departmentId);
      
      const userData = {
        name: newUser.name,
        role: newUser.role,
        departmentId: newUser.departmentId,
        departmentName: dept.departmentName,
        email: newUser.email,
        uid: user.uid,
      };
      await addDoc(collection(db, 'users'), userData);
      setUsers([...users, { id: user.uid, ...userData }]);
      setNewUser({ name: '', email: '', password: '', role: 'staff', departmentId: '' });
      setLoading(false);
    } catch (err) {
      console.error('Add user error:', err);
      setError(`Failed to add user: ${err.message}`);
      setLoading(false);
    }
  };

  const handleUpdateDept = async (userId) => {
    try {
      setLoading(true);
      const dept = departments.find(d => d.id === editUser.departmentId);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        departmentId: editUser.departmentId,
        departmentName: dept.departmentName,
      });
      setUsers(users.map(u => (u.id === userId ? { ...u, departmentId: editUser.departmentId, departmentName: dept.departmentName } : u)));
      setEditUser(null);
      setLoading(false);
    } catch (err) {
      console.error('Update dept error:', err);
      setError(`Failed to update department: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>

      {/* Add User Form */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Name"
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
            className="p-2 border rounded w-full mb-2"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 border rounded w-full mb-2"
          >
            <option value="staff">Staff</option>
            <option value="director">Director</option>
          </select>
          <select
            value={newUser.departmentId}
            onChange={(e) => setNewUser({ ...newUser, departmentId: e.target.value })}
            className="p-2 border rounded w-full mb-2"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add User
          </button>
        </form>
      </section>

      {/* User List & Edit */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Users</h2>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Department:</strong> {user.departmentName}</p>
              </div>
              <button
                onClick={() => setEditUser({ id: user.id, departmentId: user.departmentId })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Change Dept
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Department</h2>
            <select
              value={editUser.departmentId}
              onChange={(e) => setEditUser({ ...editUser, departmentId: e.target.value })}
              className="p-2 border rounded w-full mb-4"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateDept(editUser.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
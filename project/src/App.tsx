import React, { useState } from 'react';
import { ListPlus, ShoppingCart, Check, Trash2, Plus, X } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

function App() {
  const [lists, setLists] = useState<ShoppingList[]>([
    { id: '1', name: 'Groceries', items: [] }
  ]);
  const [activeListId, setActiveListId] = useState('1');
  const [newItemName, setNewItemName] = useState('');
  const [newListName, setNewListName] = useState('');
  const [showNewListInput, setShowNewListInput] = useState(false);

  const activeList = lists.find(list => list.id === activeListId);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          items: [...list.items, { id: Date.now().toString(), name: newItemName, completed: false }]
        };
      }
      return list;
    }));
    setNewItemName('');
  };

  const toggleItem = (itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return list;
    }));
  };

  const deleteItem = (itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  };

  const addList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = {
      id: Date.now().toString(),
      name: newListName,
      items: []
    };
    setLists([...lists, newList]);
    setNewListName('');
    setShowNewListInput(false);
    setActiveListId(newList.id);
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
    if (activeListId === listId && lists.length > 1) {
      setActiveListId(lists[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Shopping List</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Lists Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">My Lists</h2>
                <button
                  onClick={() => setShowNewListInput(true)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <ListPlus className="w-5 h-5" />
                </button>
              </div>

              {showNewListInput && (
                <form onSubmit={addList} className="mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="List name"
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="p-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewListInput(false)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}

              <ul className="space-y-2">
                {lists.map(list => (
                  <li
                    key={list.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      activeListId === list.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      onClick={() => setActiveListId(list.id)}
                      className="flex-1"
                    >
                      {list.name}
                    </span>
                    {lists.length > 1 && (
                      <button
                        onClick={() => deleteList(list.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active List */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{activeList?.name}</h2>
              
              <form onSubmit={addItem} className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add new item"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add Item
                  </button>
                </div>
              </form>

              <ul className="space-y-2">
                {activeList?.items.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`p-1 rounded-full ${
                          item.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <span className={item.completed ? 'line-through text-gray-400' : ''}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>

              {activeList?.items.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your shopping list is empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
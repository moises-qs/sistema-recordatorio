const STORAGE_KEY = 'edureminder_data';

export const storage = {
   getReminders() {
      try {
         const data = localStorage.getItem(STORAGE_KEY);
         return data ? JSON.parse(data) : [];
      } catch (error) {
         console.error('Error loading reminders:', error);
         return [];
      }
   },

   saveReminders(reminders) {
      try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
         return true;
      } catch (error) {
         console.error('Error saving reminders:', error);
         return false;
      }
   },

   addReminder(reminder) {
      const reminders = this.getReminders();
      const newReminder = {
         id: Date.now().toString(),
         ...reminder,
         createdAt: new Date().toISOString(),
         completed: false
      };
      reminders.push(newReminder);
      this.saveReminders(reminders);
      return newReminder;
   },

   updateReminder(id, updates) {
      const reminders = this.getReminders();
      const index = reminders.findIndex(r => r.id === id);
      if (index !== -1) {
         reminders[index] = { ...reminders[index], ...updates };
         this.saveReminders(reminders);
         return reminders[index];
      }
      return null;
   },

   deleteReminder(id) {
      const reminders = this.getReminders();
      const filtered = reminders.filter(r => r.id !== id);
      this.saveReminders(filtered);
      return filtered;
   },

   toggleComplete(id) {
      const reminders = this.getReminders();
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
         reminder.completed = !reminder.completed;
         reminder.completedAt = reminder.completed ? new Date().toISOString() : null;
         this.saveReminders(reminders);
         return reminder;
      }
      return null;
   },

   clearCompleted() {
      const reminders = this.getReminders();
      const active = reminders.filter(r => !r.completed);
      this.saveReminders(active);
      return active;
   }
};
const MEALS_KEY = 'nutrifoto:meals:v1';
const PROFILE_KEY = 'nutrifoto:profile:v1';
const ACTIVITY_KEY = 'nutrifoto:activity:v1';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getMeals() { return read(MEALS_KEY, []); },
  saveMeal(meal) {
    const meals = [meal, ...read(MEALS_KEY, [])].slice(0, 500);
    write(MEALS_KEY, meals);
    return meal;
  },
  deleteMeal(id) {
    write(MEALS_KEY, read(MEALS_KEY, []).filter((meal) => meal.id !== id));
  },
  getProfile() { return read(PROFILE_KEY, null); },
  saveProfile(profile) { write(PROFILE_KEY, profile); return profile; },
  getActivity() { return read(ACTIVITY_KEY, []); },
  saveActivity(entry) {
    const activity = [entry, ...read(ACTIVITY_KEY, [])].slice(0, 500);
    write(ACTIVITY_KEY, activity);
    return entry;
  }
};

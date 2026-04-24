import { supabase } from './supabase';
import type { Pet } from '../app/data/mockData';

export const petService = {
  // Get all pets for a user
  async getUserPets(userId: string): Promise<Pet[]> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    } catch (error) {
      console.error('Failed to fetch user pets:', error);
      throw error;
    }
  },

  // Create a new pet
  async createPet(userId: string, petData: Omit<Pet, 'id' | 'userId' | 'createdAt'>): Promise<Pet> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([
          {
            user_id: userId,
            name: petData.name,
            type: petData.type,
            breed: petData.breed,
            age: petData.age,
            weight: petData.weight,
            color: petData.color,
            image: petData.image,
            medical_info: petData.medicalInfo,
            birthday: petData.birthday,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Pet;
    } catch (error) {
      console.error('Failed to create pet:', error);
      throw error;
    }
  },

  // Update a pet
  async updatePet(petId: string, petData: Partial<Omit<Pet, 'id' | 'userId' | 'createdAt'>>): Promise<Pet> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update({
          name: petData.name,
          type: petData.type,
          breed: petData.breed,
          age: petData.age,
          weight: petData.weight,
          color: petData.color,
          image: petData.image,
          medical_info: petData.medicalInfo,
          birthday: petData.birthday,
        })
        .eq('id', petId)
        .select()
        .single();

      if (error) throw error;
      return data as Pet;
    } catch (error) {
      console.error('Failed to update pet:', error);
      throw error;
    }
  },

  // Delete a pet
  async deletePet(petId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete pet:', error);
      throw error;
    }
  },

  // Get a single pet
  async getPet(petId: string): Promise<Pet> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (error) throw error;
      return data as Pet;
    } catch (error) {
      console.error('Failed to fetch pet:', error);
      throw error;
    }
  },
};
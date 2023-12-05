import mongoose from "mongoose"
import { User, Post } from './model.js'

async function connectToDatabase() {
    try {
      await mongoose.connect('mongodb+srv://paolomartinsribeiro:9A5km1WmG0pllmio@cluster0.ch5bkmd.mongodb.net/TPFinalChap2Node', {
        useUnifiedTopology: true
      });
  
      console.log('Connecté à MongoDB avec succès!');
    } catch (error) {
      console.error('Erreur de connexion à MongoDB :', error.message);
    }
  }

  connectToDatabase()
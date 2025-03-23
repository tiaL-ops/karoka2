import { saveKarokaResult } from '../main.js';
import { auth } from './firebase.js';



export async function initResults() {
  const container = document.getElementById("results-output");
  const raw = localStorage.getItem("karoka_result");
  
 
  if (!raw || !container) {
    container.textContent = "No result found. Please take the quiz first.";
    return;
  }

  let profile;
  try {
    profile = JSON.parse(raw);

  } catch (e) {
    container.textContent = "Error loading your result. Please retake the quiz.";
    return;
  }

  const { topType, alsoTypes, identity, learningStyle, affirmation, careers } = profile;

  const typeToCharacter = {
    finisher: { name: "Aomine", image: "aomine.JPG", title: "The Finisher" },
    mirror: { name: "Kise", image: "kise.JPG", title: "The Mirror" },
    strategist: { name: "Midorima", image: "midorima.JPG", title: "The Strategist" },
    giant: { name: "Murasakibara", image: "murasakibara.JPG", title: "The Giant" },
    visionary: { name: "Akashi", image: "akashi.JPG", title: "The Visionary" },
    shadow: { name: "Kuroko", image: "kuroko.JPG", title: "The Shadow" },
    climber: { name: "Kagami", image: "kagami.JPG", title: "The Climber" }
  };

  const character = typeToCharacter[topType] || typeToCharacter["shadow"];
  const imagePath = `images/${character.image}`;

  container.innerHTML = `
    <div class="bg-gray-100 text-gray-800 p-5 rounded-xl shadow-md max-w-xl mx-auto font-sans">
      <div class="flex gap-4 items-center">
        <img src="${imagePath}" alt="${character.name}" class="w-28 h-28 rounded-lg object-cover border border-gray-300 shadow-sm" />
        <div class="flex-1">
          <h2 class="text-xl font-bold text-indigo-600 mb-1">${character.title}</h2>
          <p class="text-sm text-gray-600 mb-1">Inspired by <span class="font-semibold">${character.name}</span></p>
          <p class="text-xs italic text-gray-500">
            Also part of your blend:
            ${alsoTypes?.map(t => `<span class="capitalize">${t}</span>`).join(" & ") || "None"}
          </p>
        </div>
      </div>

      <div class="mt-4 text-sm leading-relaxed">
        <p class="mb-3">${identity}</p>
        <p class="mb-3">${learningStyle}</p>
        <p class="text-indigo-500 font-medium mb-4">💬 ${affirmation}</p>

        <h3 class="text-sm font-semibold mb-1 text-indigo-600">Suggested Career Paths</h3>
        <ul class="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm text-gray-700">
          ${careers.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

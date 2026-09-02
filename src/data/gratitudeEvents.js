// data/gratitudeEvents.js
//
// Edit, add or remove events here — the UI component never needs to change.
// `icon` must match one of the keys in the ICONS map inside ThankYouHero.jsx
// (laptop, code, lightbulb, users, rocket). Add more icons there if you add
// new keys here.

const gratitudeEvents = [
  
  {
    id: "bootcamp",
    title: "Coding Bootcamp",
    icon: "code",
    image: "/images/events/bootcamp.png",
    thankYou:
      "for creating a space where we could learn by building. The bootcamp gave us confidence, real skills and the courage to start.",
    description: "We came in curious, and left knowing how to build.",
  },
  {
    id: "hackathon",
    title: "EduHack Hackathon",
    icon: "lightbulb",
    image: "/images/events/hackathon.jpeg",
    thankYou:
      "for giving our ideas a place to become real projects. The hackathon pushed us to solve real problems with technology.",
    description: "One night, one idea, one working prototype.",
  },
  {
    id: "interaction",
    title: "Learning From Industry",
    icon: "users",
    image: "/images/events/intrections.jpeg",
    thankYou:
      "for the opportunities to meet, learn from and interact with inspiring people. These conversations showed us what's possible beyond the classroom.",
    description: "A glimpse of the industry, straight from the people in it.",
  },
  {
    id: "projects",
    title: "Building Real Projects",
    icon: "rocket",
    image: "/images/events/projects.jpeg",
    thankYou:
      "for believing that students can build meaningful things. Your initiatives gave us the confidence to turn ideas into working projects.",
    description: "From a sketch on paper to something that actually runs.",
  },
  {
    id: "laptops",
    title: "Laptops for Students",
    icon: "laptop",
    image: "/images/events/laptops.png",
    thankYou:
      "for helping us dream bigger and learn better. The laptops have opened new doors for our education, creativity and future.",
    description: "Your support gave us more than a laptop — it gave us new possibilities.",
  },
  
];

export default gratitudeEvents;
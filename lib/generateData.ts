import { User } from "@/types/api";

const firstNames = [
  "James",
  "Olivia",
  "Liam",
  "Sophia",
  "Noah",
  "Ava",
  "Ethan",
  "Mia",
  "Lucas",
  "Isabella",
  "Henry",
  "Amelia",
  "Alexander",
  "Harper",
  "Benjamin",
  "Evelyn",
  "William",
  "Ella",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Rodriguez",
  "Lewis",
  "Lee",
];

const streets = [
  "Oak",
  "Maple",
  "Pine",
  "Cedar",
  "Elm",
  "Willow",
  "Birch",
  "Walnut",
  "Aspen",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Seattle",
  "Boston",
  "Miami",
];

const companyNames = [
  "Acme Technologies",
  "BrightPath Solutions",
  "Evergreen Industries",
  "Summit Financial Group",
  "UrbanGrid Systems",
  "BluePeak Analytics",
  "NextWave Media",
  "SilverOak Consulting",
  "Vertex Innovations",
  "NorthStar Logistics",
];

const slogans = [
  "Innovating the future, today",
  "Your success, our mission",
  "Engineering tomorrow's solutions",
  "Connecting people with possibilities",
  "Empowering businesses worldwide",
  "Driven by quality, powered by trust",
  "Building the digital frontier",
  "Where vision meets execution",
  "Turning ideas into reality",
  "Simplifying complexity",
];

const industries = [
  "custom software development",
  "digital marketing services",
  "financial consulting",
  "renewable energy solutions",
  "data analytics & AI",
  "cloud infrastructure management",
  "supply chain optimization",
  "enterprise IT services",
  "cybersecurity solutions",
  "web & mobile app development",
];

// Helper functions
const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const fakeUsers = (): User[] => {
  return Array.from({ length: 50 }, (_, i) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const domain = ["example.com", "mail.com", "webmail.net", "inbox.org"][
      Math.floor(Math.random() * 4)
    ];

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${username}@${domain}`,
      username: username,
      phone: `+1-${randomNumber(200, 999)}-${randomNumber(200, 999)}-${String(randomNumber(0, 9999)).padStart(4, "0")}`,
      website: `${username.replace(".", "")}.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,

      address: {
        street: `${randomNumber(10, 9999)} ${randomItem(streets)} St`,
        suite: `Suite ${randomNumber(100, 599)}`,
        city: randomItem(cities),
        zipcode: String(randomNumber(10000, 99999)),
      },

      company: {
        name: randomItem(companyNames),
        catchPhrase: randomItem(slogans),
        bs: randomItem(industries),
      },
    };
  });
};

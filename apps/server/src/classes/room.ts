export class Room {
    private users: Map<string, { id: string; name: string }> = new Map();

    addUser(id: string, name?: string): { id: string; name: string } {
        const userData = {
            id,
            name: name || this.generateName(),
        };
        this.users.set(id, userData);
        return userData;
    }

    removeUser(id: string): boolean {
        return this.users.delete(id);
    }

    updateName(id: string, name: string): boolean {
        const user = this.users.get(id);
        if (user) {
            user.name = name;
            return true;
        }
        return false;
    }

    getUser(id: string) {
        return this.users.get(id);
    }

    getUsers() {
        return Array.from(this.users.values());
    }

    private generateName(): string {
        const firstNames = [
            "James",
            "Mary",
            "John",
            "Linda",
            "Michael",
            "Patricia",
            "Robert",
            "Jennifer",
            "William",
            "Elizabeth",
            "David",
            "Jessica",
            "Richard",
            "Susan",
            "Joseph",
            "Karen",
            "Thomas",
            "Nancy",
            "Charles",
            "Betty",
            "Daniel",
            "Helen",
            "Matthew",
            "Sandra",
            "George",
            "Margaret",
            "Anthony",
            "Ashley",
            "Mark",
            "Dorothy",
        ];

        const lastNames = [
            "Smith",
            "Johnson",
            "Williams",
            "Jones",
            "Brown",
            "Davis",
            "Miller",
            "Wilson",
            "Moore",
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
            "Roberts",
            "Clark",
            "Rodriguez",
            "Lewis",
            "Lee",
            "Walker",
            "Hall",
            "Allen",
            "Young",
            "King",
            "Wright",
        ];

        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return `${randomFirstName} ${randomLastName}`;
    }
}

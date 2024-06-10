export const sidebarLinks = [
    {
        label: 'Overzicht',
        route: '/',
        imgUrl: '/icons/home.svg',
    },
    {
        label: 'Inschrijving',
        route: '/enrollment/null',
        imgUrl: '/icons/members.svg',
    }
]

export const columns = [
    { name: "Naam", uid: "firstname", sortable: true },
    { name: "Type Klas", uid: "class_type", sortable: true },
    { name: "Betaling", uid: "payment_complete", sortable: true },
    { name: "Resultaat", uid: "passed", sortable: true },
    { name: "Acties", uid: "actions", sortable: false },
]

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
]
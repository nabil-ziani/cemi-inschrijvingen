export const sidebarLinks = [
    {
        label: 'Overzicht',
        route: '/',
        imgUrl: '/icons/home.svg',
    },
    {
        label: 'Inschrijving',
        route: '/enrollment/null?type=new',
        imgUrl: '/icons/members.svg',
    }
]

export const columns = [
    { name: "Naam", uid: "firstname", sortable: true },
    { name: "Niveau", uid: "level", sortable: true },
    { name: "Type Klas", uid: "class_type", sortable: true },
    { name: "Betaling", uid: "payment_complete", sortable: true },
    { name: "Resultaat", uid: "passed", sortable: true },
    { name: "Status - 2024", uid: "status", sortable: true },
    { name: "Acties", uid: "actions", sortable: false },
]

export const statusOptions = [
    { name: "Niet heringeschreven", uid: "Niet heringeschreven" },
    { name: "Ingeschreven", uid: "Ingeschreven" },
    { name: "Onder voorbehoud", uid: "Onder voorbehoud" },
    { name: "Uitgeschreven", uid: "Uitgeschreven" },
]
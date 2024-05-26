export const sidebarLinks = [
    {
        label: 'Overzicht',
        route: '/',
        imgUrl: '/icons/home.svg',
    },
    {
        label: 'Nieuwe student',
        route: '/add-student',
        imgUrl: '/icons/add-user.svg',
    }
]

export const columns = [
    { name: "Naam", uid: "fullname", sortable: true },
    { name: "lastname", uid: "lastname", sortable: true },
    { name: "passed", uid: "passed", sortable: true },
    { name: "payment_complete", uid: "payment_complete", sortable: true },
]

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
]
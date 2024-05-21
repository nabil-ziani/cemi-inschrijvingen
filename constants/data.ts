type Enrollment = 'Heringeschreven' | 'Uitgeschreven' | 'Onder voorbehoud'

type Student = {
    firstname: string,
    lastname: string,
    birthdate: string,
    phone_1: string,
    phone_2: string,
    email_1: string,
    email_2: string,
    status: Enrollment
}
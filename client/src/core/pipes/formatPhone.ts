export const formatPhone = (phone?: string | number): string => {
    if (!phone) return ''

    let digits = String(phone).replace(/\D/g, '')

    if (digits.startsWith('992')) {
        digits = digits.slice(3)
    }

    const match = digits.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/)

    if (!match) {
        return String(phone)
    }

    const [, region, part1, part2, part3] = match

    return `(${region}) ${part1} ${part2} ${part3}`
}
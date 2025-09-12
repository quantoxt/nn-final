const Links: { title: string, href: string }[] = [
    {
        title: "Billionaire",
        href: "/category/billionaire"
    },
        {
        title: "Mafia",
        href: "/category/mafia"
    },
            {
        title: "Werewolf",
        href: "/category/werewolf"
    },
                {
        title: "Fantasy",
        href: "/category/fantasy"
    },
    {
        title: "LGBTQ",
        href: "/category/lgbtq"
    },
    {
        title: "Erotica",
        href: "/category/erotica",
    },
    {
        title: "Young Adult",
        href: "/category/young-adult"
    }

]
export const navLinks = [...Links].sort((a, b) => a.title.localeCompare(b.title));
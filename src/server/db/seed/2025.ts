import { db } from "@/server/db";
import {
  dbtCategory,
  dbtCategoryTypesPoints,
  dbtMovie,
  dbtReceiver,
  dbtNomination,
} from "@/server/db/schema/aposcar";

type CategoryType = "main" | "regular" | "secondary" | undefined;

const categories = [
  {
    name: "Best Picture",
    type: "main" as CategoryType,
    description:
      "Honoring the producers of the year's most outstanding motion picture.",
  },
  {
    name: "Directing",
    type: "main" as CategoryType,
    description: "Honoring the best achievement in film direction.",
  },
  {
    name: "Actress In A Leading Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actress in a leading role.",
  },
  {
    name: "Actor In A Leading Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actor in a leading role.",
  },
  {
    name: "Actress In A Supporting Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actress in a supporting role.",
  },
  {
    name: "Actor In A Supporting Role",
    type: "main" as CategoryType,
    description:
      "Recognizing the best performance by an actor in a supporting role.",
  },
  {
    name: "Writing (Adapted Screenplay)",
    type: "main" as CategoryType,
    description:
      "The best screenplay adapted from previously published or produced material.",
  },
  {
    name: "Writing (Original Screenplay)",
    type: "main" as CategoryType,
    description:
      "The best screenplay not based upon previously published material.",
  },
  {
    name: "Animated Feature Film",
    type: "main" as CategoryType,
    description: "The best full-length film primarily created using animation.",
  },
  {
    name: "International Feature Film",
    type: "main" as CategoryType,
    description:
      "The best feature-length film produced outside the United States with a predominantly non-English dialogue track.",
  },
  {
    name: "Music (Original Song)",
    description: "The best original song written specifically for a film.",
  },
  {
    name: "Music (Original Score)",
    description:
      "The best original musical score created specifically for a film.",
  },
  {
    name: "Sound",
    description:
      "Honoring excellence in the creation, recording, mixing, and design of a film's sound.",
  },
  {
    name: "Film Editing",
    description:
      "Recognizing outstanding achievement in the editing of a film.",
  },
  {
    name: "Visual Effects",
    description: "Recognizing outstanding achievement in visual effects.",
  },
  {
    name: "Cinematography",
    description:
      "Honoring outstanding achievement in motion picture photography.",
  },
  {
    name: "Costume Design",
    description:
      "Recognizing excellence in the creation of costumes for a film.",
  },
  {
    name: "Makeup And Hairstyling",
    description: "Honoring excellence in makeup and hairstyling for a film.",
  },
  {
    name: "Production Design",
    description:
      "Recognizing excellence in the visual environment and set design of a film.",
  },
  {
    name: "Documentary Feature Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or longer.",
  },
  {
    name: "Documentary Short Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or less.",
  },
  {
    name: "Animated Short Film",
    description: "The best short film primarily created using animation.",
  },
  {
    name: "Live Action Short Film",
    description: "The best short film not primarily animated.",
  },
].map((c) => ({
  ...c,
  slug: c.name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replaceAll(" ", "-"),
}));

const points: { categoryType: CategoryType; points: number }[] = [
  {
    categoryType: "main",
    points: 10,
  },
  {
    categoryType: "regular",
    points: 5,
  },
  {
    categoryType: "secondary",
    points: 3,
  },
];

const movies = [
  {
    slug: "conclave",
    name: "Conclave",
    tagline: "WHAT HAPPENS BEHIND THESE WALLS WILL CHANGE EVERYTHING.",
    description:
      "After the unexpected death of the Pope, Cardinal Lawrence is tasked with managing the covert and ancient ritual of electing a new one. Sequestered in the Vatican with the Catholic Church\u2019s most powerful leaders until the process is complete, Lawrence finds himself at the center of a conspiracy that could lead to its downfall.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/7/7/2/5/3/877253-conclave-0-1000-0-1500-crop.jpg?v=f9cbf50dec",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/pc/vk/od/sg/Conclave-1200-1200-675-675-crop-000000.jpg?v=19e6dafecc",
    letterboxd: "https://letterboxd.com/film/conclave/",
  },
  {
    slug: "emilia-perez",
    name: "Emilia P\u00e9rez",
    tagline: "PASSION HAS A NEW NAME.",
    description:
      "Rita, an underrated lawyer working for a large law firm more interested in getting criminals out of jail than bringing them to justice, is hired by the leader of a criminal organization.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/7/7/6/0/8/877608-emilia-perez-0-1000-0-1500-crop.jpg?v=cc7782128e",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/04/ks/7w/la/EmiliaPerez-1200-1200-675-675-crop-000000.jpg?v=417fe2842a",
    letterboxd: "https://letterboxd.com/film/emilia-perez/",
  },
  {
    slug: "anora",
    name: "Anora",
    tagline: "LOVE IS A HUSTLE.",
    description:
      "Anora, a young sex worker from Brooklyn, gets her chance at a Cinderella story when she meets and impulsively marries the son of an oligarch. Once the news reaches Russia, her fairytale is threatened as the parents set out for New York to get the marriage annulled.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/5/9/5/4/0/959540-anora-0-1000-0-1500-crop.jpg?v=6f92877033",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/5d/nm/eu/bz/anora-1200-1200-675-675-crop-000000.jpg?v=220493ca2d",
    letterboxd: "https://letterboxd.com/film/anora/",
  },
  {
    slug: "the-brutalist",
    name: "The Brutalist",
    tagline: "WELCOME TO AMERICA.",
    description:
      "Escaping post-war Europe, visionary architect L\u00e1szl\u00f3 T\u00f3th arrives in America to rebuild his life, his work, and his marriage to his wife Erzs\u00e9bet after being forced apart during wartime by shifting borders and regimes. On his own in a strange new country, L\u00e1szl\u00f3 settles in Pennsylvania, where the wealthy and prominent industrialist Harrison Lee Van Buren recognizes his talent for building. But power and legacy come at a heavy cost.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/4/7/8/4/2/8/478428-the-brutalist-0-1000-0-1500-crop.jpg?v=e23890665e",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/jx/rq/sh/k6/mN3a8MVeF57XBJCZGthr1nQlkjk-1200-1200-675-675-crop-000000.jpg?v=5e4be71ae8",
    letterboxd: "https://letterboxd.com/film/the-brutalist/",
  },
  {
    slug: "wicked-2024",
    name: "Wicked",
    tagline: "EVERYONE DESERVES THE CHANCE TO FLY.",
    description:
      "When ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda, the two\u2019s unlikely friendship is tested as they begin to fulfill their respective destinies as Glinda the Good and the Wicked Witch of the West.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/3/3/7/0/3/6/337036-wicked-2024-0-1000-0-1500-crop.jpg?v=c519c37ff7",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/j4/ly/fa/jz/3M5USne9t9XKMmb4nJ7SfcAYh6X-1200-1200-675-675-crop-000000.jpg?v=e85c5e4529",
    letterboxd: "https://letterboxd.com/film/wicked-2024/",
  },
  {
    slug: "a-complete-unknown",
    name: "A Complete Unknown",
    tagline: "THE BALLAD OF A TRUE ORIGINAL.",
    description:
      "New York, early 1960s. Against the backdrop of a vibrant music scene and tumultuous cultural upheaval, an enigmatic 19-year-old from Minnesota arrives in the West Village with his guitar and revolutionary talent, destined to change the course of American music.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/5/8/6/5/8/3/586583-a-complete-unknown-0-1000-0-1500-crop.jpg?v=f14ab6ecf6",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/y7/ha/y0/tk/a-complete-unknown-1200-1200-675-675-crop-000000.jpg?v=5519495df2",
    letterboxd: "https://letterboxd.com/film/a-complete-unknown/",
  },
  {
    slug: "dune-part-two",
    name: "Dune: Part Two",
    tagline: "LONG LIVE THE FIGHTERS.",
    description:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/6/1/7/4/4/3/617443-dune-part-two-0-1000-0-1500-crop.jpg?v=cc533700f8",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/qp/uv/i4/8b/l6b9YZEokZl1nt7q0pprrur6btG-1200-1200-675-675-crop-000000.jpg?v=ed21d71137",
    letterboxd: "https://letterboxd.com/film/dune-part-two/",
  },
  {
    slug: "the-substance",
    name: "The Substance",
    tagline: "IF YOU FOLLOW THE INSTRUCTIONS, WHAT COULD GO WRONG?",
    description:
      "A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/3/8/1/4/0/838140-the-substance-0-1000-0-1500-crop.jpg?v=ab9e1072f8",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/ju/7r/z4/9i/xfSVZf7naMoGuqoHaQhbvfPrfWs-1200-1200-675-675-crop-000000.jpg?v=adde104f43",
    letterboxd: "https://letterboxd.com/film/the-substance/",
  },
  {
    slug: "nickel-boys",
    name: "Nickel Boys",
    tagline: null,
    description:
      "Chronicles the powerful friendship between two young Black teenagers navigating the harrowing trials of reform school together in Florida.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/2/6/5/8/9/926589-nickel-boys-0-1000-0-1500-crop.jpg?v=c90912e607",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/0m/nv/ic/99/sy7Q8ttHlw4yMRoBarPlNSzlhxf-1200-1200-675-675-crop-000000.jpg?v=3aa6fcdece",
    letterboxd: "https://letterboxd.com/film/nickel-boys/",
  },
  {
    slug: "im-still-here-2024",
    name: "I\u2019m Still Here",
    tagline: "WHEN A MOTHER\u2019S COURAGE DEFIES TYRANNY, HOPE IS REBORN.",
    description:
      "In the early 1970s, the military dictatorship in Brazil reaches its height. The Paiva family - Rubens, Eunice, and their five children - live in a beachside house in Rio, open to all their friends. One day, Rubens is taken for questioning and does not return.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/0/1/6/7/1/901671-im-still-here-2024-0-1000-0-1500-crop.jpg?v=62be7ea503",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/wz/fd/qp/mi/i'm%20still-1200-1200-675-675-crop-000000.jpg?v=76e2958e0b",
    letterboxd: "https://letterboxd.com/film/im-still-here-2024/",
  },
  {
    slug: "a-real-pain",
    name: "A Real Pain",
    tagline: "JOIN THE FAMILY.",
    description:
      "Mismatched cousins David and Benji reunite for a tour through Poland to honor their beloved grandmother. The adventure takes a turn when the pair\u2019s old tensions resurface against the backdrop of their family history.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/1/3/2/5/8/913258-a-real-pain-0-1000-0-1500-crop.jpg?v=893a943872",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/j6/nm/pz/7d/cJUaa7KdSgxFMri4hdO6ZnxmLcr-1200-1200-675-675-crop-000000.jpg?v=41e980e877",
    letterboxd: "https://letterboxd.com/film/a-real-pain/",
  },
  {
    slug: "sing-sing-2023",
    name: "Sing Sing",
    tagline: "TRUST THE PROCESS.",
    description:
      "Divine G, imprisoned at Sing Sing for a crime he didn\u2019t commit, finds purpose by acting in a theatre group alongside other incarcerated men in this story of resilience, humanity, and the transformative power of art.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/1/9/5/7/1041957-sing-sing-2023-0-1000-0-1500-crop.jpg?v=f893b22924",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/pb/tw/7z/mm/sing%20sing-1200-1200-675-675-crop-000000.jpg?v=449b71a30e",
    letterboxd: "https://letterboxd.com/film/sing-sing-2023/",
  },
  {
    slug: "september-5",
    name: "September 5",
    tagline: null,
    description:
      "During the 1972 Summer Olympics in Munich, Germany, an American sports broadcasting team must adapt to live coverage the Israeli athletes being held hostage by a terrorist group.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/9/5/7/1/8/1095718-september-5-0-1000-0-1500-crop.jpg?v=d70c1a941c",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/ff/f7/uf/b3/s5-1200-1200-675-675-crop-000000.jpg?v=a312e314f8",
    letterboxd: "https://letterboxd.com/film/september-5/",
  },
  {
    slug: "nosferatu-2024",
    name: "Nosferatu",
    tagline: "SUCCUMB TO THE DARKNESS.",
    description:
      "A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, causing untold horror in its wake.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/3/5/9/5/0/5/359505-nosferatu-2024-0-1000-0-1500-crop.jpg?v=a12d4ad648",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/l3/72/mx/b8/vqToPEywI1QzUNd5bJceldmrWUf-1200-1200-675-675-crop-000000.jpg?v=cdd95a78e1",
    letterboxd: "https://letterboxd.com/film/nosferatu-2024/",
  },
  {
    slug: "gladiator-ii",
    name: "Gladiator II",
    tagline: "PREPARE TO BE ENTERTAINED.",
    description:
      "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the future of the Empire at stake, Lucius must look to his past to find strength and honor to return the glory of Rome to its people.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/4/8/6/9/7/8/486978-gladiator-ii-0-1000-0-1500-crop.jpg?v=0fb2edf525",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/85/h2/uy/p3/gladiator%202-1200-1200-675-675-crop-000000.jpg?v=35462ea2c8",
    letterboxd: "https://letterboxd.com/film/gladiator-ii/",
  },
  {
    slug: "maria-2024",
    name: "Maria",
    tagline: null,
    description:
      "Maria Callas, the world\u2019s greatest opera singer, lives the last days of her life in 1970s Paris, as she confronts her identity and life.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/3/6/0/4/0/936040-maria-2024-0-1000-0-1500-crop.jpg?v=66ba1a738c",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/lr/xy/8y/pz/maria-1200-1200-675-675-crop-000000.jpg?v=bb6a3e4317",
    letterboxd: "https://letterboxd.com/film/maria-2024/",
  },
  {
    slug: "the-apprentice-2024",
    name: "The Apprentice",
    tagline: "AN AMERICAN HORROR STORY.",
    description:
      "A young Donald Trump, eager to make his name as a hungry scion of a wealthy family in 1970s New York, comes under the spell of Roy Cohn, the cutthroat attorney who would help create the Donald Trump we know today. Cohn sees in Trump the perfect prot\u00e9g\u00e9\u2014someone with raw ambition, a hunger for success, and a willingness to do whatever it takes to win.",
    poster:
      "https://a.ltrbxd.com/resized/sm/upload/yj/8m/d9/4r/apprentice_xxlg-0-1000-0-1500-crop.jpg?v=684581b66b",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/ah/2m/d0/i8/TheApprentice-1200-1200-675-675-crop-000000.jpg?v=31b97bae93",
    letterboxd: "https://letterboxd.com/film/the-apprentice-2024/",
  },
  {
    slug: "a-different-man",
    name: "A Different Man",
    tagline: "THE MORE YOU CHANGE, THE MORE YOU STAY THE SAME.",
    description:
      "Aspiring actor Edward undergoes a radical medical procedure to drastically transform his appearance. But his new dream face quickly turns into a nightmare, as he loses out on the role he was born to play and becomes obsessed with reclaiming what was lost.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/9/1/2/9/1/891291-a-different-man-0-1000-0-1500-crop.jpg?v=f19de2db41",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/gp/m2/rs/1m/ADifferentMan-1200-1200-675-675-crop-000000.jpg?v=0ad096bcad",
    letterboxd: "https://letterboxd.com/film/a-different-man/",
  },
  {
    slug: "the-seed-of-the-sacred-fig",
    name: "The Seed of the Sacred Fig",
    tagline: null,
    description:
      "An investigating judge in the Revolutionary Court in Tehran grapples with mistrust and paranoia as nationwide political protests intensify and his gun mysteriously disappears. Suspecting the involvement of his wife and their two daughters, he imposes drastic measures at home, causing tensions to rise. Step by step, social norms and the rules of family life are being suspended.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/6/1/8/0/6/1161806-the-seed-of-the-sacred-fig-0-1000-0-1500-crop.jpg?v=93abc60195",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/48/cg/6b/cd/seed-1200-1200-675-675-crop-000000.jpg?v=d7a550833a",
    letterboxd: "https://letterboxd.com/film/the-seed-of-the-sacred-fig/",
  },
  {
    slug: "the-girl-with-the-needle",
    name: "The Girl with the Needle",
    tagline: null,
    description:
      "Struggling to survive in post-WWI Copenhagen, a newly unemployed and pregnant young woman is taken in by a charismatic elder to help run an underground adoption agency. The two form an unexpected bond, until a sudden discovery changes everything.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/6/3/2/1/1116321-the-girl-with-the-needle-0-1000-0-1500-crop.jpg?v=7d75e28758",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/kn/d4/v3/ad/TheGirlWithTheNeedle-1200-1200-675-675-crop-000000.jpg?v=8c61e15a37",
    letterboxd: "https://letterboxd.com/film/the-girl-with-the-needle/",
  },
  {
    slug: "the-wild-robot",
    name: "The Wild Robot",
    tagline: "DISCOVER YOUR TRUE NATURE.",
    description:
      "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island\u2019s animals and cares for an orphaned baby goose.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/7/1/1/9/6/1071196-the-wild-robot-0-1000-0-1500-crop.jpg?v=a70bdbaea0",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/lo/yv/o4/a4/tR0RttXyT10l7GxpDSLTalPtLVj-1200-1200-675-675-crop-000000.jpg?v=3bd0088c78",
    letterboxd: "https://letterboxd.com/film/the-wild-robot/",
  },
  {
    slug: "alien-romulus",
    name: "Alien: Romulus",
    tagline: "IN SPACE, NO ONE CAN HEAR YOU.",
    description:
      "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/5/0/4/5/9/850459-alien-romulus-0-1000-0-1500-crop.jpg?v=acabb7fd83",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/9k/b6/vt/j7/6kGlcZ1T7V2MxVlQbiynxJdrHrl-1200-1200-675-675-crop-000000.jpg?v=a61d6bcc85",
    letterboxd: "https://letterboxd.com/film/alien-romulus/",
  },
  {
    slug: "inside-out-2-2024",
    name: "Inside Out 2",
    tagline: "MAKE ROOM FOR NEW EMOTIONS.",
    description:
      "Teenager Riley\u2019s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who\u2019ve long been running a successful operation by all accounts, aren\u2019t sure how to feel when Anxiety shows up. And it looks like she\u2019s not alone.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/2/1/5/7/8/921578-inside-out-2-0-1000-0-1500-crop.jpg?v=efa25e5cca",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/0x/nf/kx/7e/inside-1200-1200-675-675-crop-000000.jpg?v=0c03894316",
    letterboxd: "https://letterboxd.com/film/inside-out-2-2024/",
  },
  {
    slug: "elton-john-never-too-late",
    name: "Elton John: Never Too Late",
    tagline: "HE RISKED EVERYTHING TO FIND HIMSELF.",
    description:
      "Sir Elton John looks back on his life and the astonishing early days of his 50-year career in this emotionally charged, full-circle journey. As he prepares for his final concert in North America at Dodger Stadium, Elton takes us back in time and recounts his struggles with adversity, abuse, and addiction, and how he overcame them to become the icon he is today.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/7/9/7/4/9/879749-elton-john-never-too-late-0-1000-0-1500-crop.jpg?v=adda3cad3c",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/elton-john-never-too-late/",
  },
  {
    slug: "kingdom-of-the-planet-of-the-apes",
    name: "Kingdom of the Planet of the Apes",
    tagline: "NO ONE CAN STOP THE REIGN.",
    description:
      "Several generations following Caesar\u2019s reign, apes \u2013 now the dominant species \u2013 live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all he\u2019s known about the past and to make choices that will define a future for apes and humans alike.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/5/7/8/7/7/4/578774-kingdom-of-the-planet-of-the-apes-0-1000-0-1500-crop.jpg?v=b765efe92a",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/62/f0/gf/so/fypydCipcWDKDTTCoPucBsdGYXW-1200-1200-675-675-crop-000000.jpg?v=af972bf69e",
    letterboxd:
      "https://letterboxd.com/film/kingdom-of-the-planet-of-the-apes/",
  },
  {
    slug: "better-man-2024",
    name: "Better Man",
    tagline: "FAME MAKES MONKEYS OF US ALL.",
    description:
      "Follow Robbie Williams\u2019 journey from childhood, to being the youngest member of chart-topping boyband Take That, through to his unparalleled achievements as a record-breaking solo artist \u2013 all the while confronting the challenges that stratospheric fame and success can bring.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/1/7/4/7/1/717471-better-man-2024-0-1000-0-1500-crop.jpg?v=e2168b52aa",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/4w/wb/zw/0e/better%20man-1200-1200-675-675-crop-000000.jpg?v=8470b8e9fb",
    letterboxd: "https://letterboxd.com/film/better-man-2024/",
  },
  {
    slug: "flow-2024",
    name: "Flow",
    tagline: null,
    description:
      "A solitary cat, displaced by a great flood, finds refuge on a boat with various species and must navigate the challenges of adapting to a transformed world together.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/3/9/4/5/1/739451-flow-2024-0-1000-0-1500-crop.jpg?v=32f49339d9",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/tx/mz/e7/j4/ozvcHbXhCJE0BtUaR6jOfF8MOYE-1200-1200-675-675-crop-000000.jpg?v=c67c91ad39",
    letterboxd: "https://letterboxd.com/film/flow-2024/",
  },
  {
    slug: "wallace-gromit-vengeance-most-fowl",
    name: "Wallace & Gromit: Vengeance Most Fowl",
    tagline: "NEW FRIENDS. OLD ENEMIES.",
    description:
      "Gromit\u2019s concern that Wallace is becoming too dependent on his inventions proves justified, when Wallace invents a \u201csmart\u201d gnome that seems to develop a mind of its own. When it emerges that a vengeful figure from the past might be masterminding things, it falls to Gromit to battle sinister forces and save his master\u2026 or Wallace may never be able to invent again!",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/3/4/5/6/1/834561-wallace-gromit-vengeance-most-fowl-0-1000-0-1500-crop.jpg?v=b5b3c56e5e",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/8/3/4/5/6/1/tmdb/lJUaW1DnOqWZpyTKzFlG1kNxvoD-1200-1200-675-675-crop-000000.jpg?v=24e9279861",
    letterboxd:
      "https://letterboxd.com/film/wallace-gromit-vengeance-most-fowl/",
  },
  {
    slug: "memoir-of-a-snail",
    name: "Memoir of a Snail",
    tagline:
      "LIFE CAN ONLY BE UNDERSTOOD BACKWARDS, BUT WE HAVE TO LIVE IT FORWARDS.",
    description:
      "Forcibly separated from her twin brother when they are orphaned, a melancholic misfit learns how to find confidence within herself amid the clutter of misfortunes and everyday life.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/5/9/8/2/9/959829-memoir-of-a-snail-0-1000-0-1500-crop.jpg?v=e23dff99a0",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/cx/xc/2o/ay/memoir-1200-1200-675-675-crop-000000.jpg?v=726c84381c",
    letterboxd: "https://letterboxd.com/film/memoir-of-a-snail/",
  },
  {
    slug: "no-other-land",
    name: "No Other Land",
    tagline: null,
    description:
      "This film made by a Palestinian-Israeli collective shows the destruction of the occupied West Bank\u2019s Masafer Yatta by Israeli soldiers and the alliance which develops between the Palestinian activist Basel and Israeli journalist Yuval.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/5/8/7/4/1115874-no-other-land-0-1000-0-1500-crop.jpg?v=7a96e00fce",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/b8/w7/es/1a/8FNqLsZfkqvGXWDupWUj359iMwc-1200-1200-675-675-crop-000000.jpg?v=9f45914c75",
    letterboxd: "https://letterboxd.com/film/no-other-land/",
  },
  {
    slug: "sugarcane",
    name: "Sugarcane",
    tagline: null,
    description:
      "An investigation into abuse and missing children at an Indian residential school ignites a reckoning on the nearby Sugarcane Reserve.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/4/8/4/6/1044846-sugarcane-0-1000-0-1500-crop.jpg?v=3c1c72edea",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/pb/ot/qm/fi/Sugarcane-1200-1200-675-675-crop-000000.jpg?v=3ab883f2a1",
    letterboxd: "https://letterboxd.com/film/sugarcane/",
  },
  {
    slug: "soundtrack-to-a-coup-detat",
    name: "Soundtrack to a Coup d\u2019\u00c9tat",
    tagline: null,
    description:
      "In 1960, United Nations: the Global South ignites a political earthquake, musicians Abbey Lincoln and Max Roach crash the Security Council, Nikita Khrushchev bangs his shoe denouncing America\u2019s color bar, while the U.S. dispatches jazz ambassador Louis Armstrong to the Congo to deflect attention from its first African post-colonial coup.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/9/8/3/3/2/1098332-soundtrack-to-a-coup-detat-0-1000-0-1500-crop.jpg?v=f32f1b835c",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/5m/ea/lf/4d/SoundtracktoaCoup-1200-1200-675-675-crop-000000.jpg?v=5de1d5b73b",
    letterboxd: "https://letterboxd.com/film/soundtrack-to-a-coup-detat/",
  },
  {
    slug: "black-box-diaries",
    name: "Black Box Diaries",
    tagline:
      "A NIGHT THAT CHANGED HER LIFE BECAME A SCANDAL THAT ROCKED A NATION.",
    description:
      "Journalist Shiori It\u014d embarks on a courageous investigation of her own sexual assault in an improbable attempt to prosecute her high-profile offender. Her quest becomes a landmark case in Japan, exposing the country\u2019s outdated judicial and societal systems.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/9/8/3/1/7/1098317-black-box-diaries-0-1000-0-1500-crop.jpg?v=e1b258a7c0",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/ir/28/i1/l0/BlackBoxDiaries-1200-1200-675-675-crop-000000.jpg?v=57dc55215e",
    letterboxd: "https://letterboxd.com/film/black-box-diaries/",
  },
  {
    slug: "porcelain-war",
    name: "Porcelain War",
    tagline: null,
    description:
      "Under roaring fighter jets and missile strikes, Ukrainian artists Slava, Anya, and Andrey choose to stay behind and fight, contending with the soldiers they have become. Defiantly finding beauty amid destruction, they show that although it\u2019s easy to make people afraid, it\u2019s hard to destroy their passion for living.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/9/8/3/2/9/1098329-porcelain-war-0-1000-0-1500-crop.jpg?v=9eb1d5c455",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/b2/kb/is/5n/PorcelainWar-1200-1200-675-675-crop-000000.jpg?v=306851e9fe",
    letterboxd: "https://letterboxd.com/film/porcelain-war/",
  },
  {
    slug: "wander-to-wonder",
    name: "Wander to Wonder",
    tagline: null,
    description:
      "In the 1980s, Mary, Billybud, and Fumbleton starred in the children\u2019s television program Wander to Wonder. They are left alone in the studio after the show\u2019s originator passed away.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/2/7/0/3/1042703-wander-to-wonder-0-1000-0-1500-crop.jpg?v=a0e370010b",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/24/7p/je/56/WTW_04-1200-1200-675-675-crop-000000.jpg?v=b7536b3afa",
    letterboxd: "https://letterboxd.com/film/wander-to-wonder/",
  },
  {
    slug: "in-the-shadow-of-the-cypress",
    name: "In the Shadow of the Cypress",
    tagline: null,
    description:
      "A former captain, suffering from post-traumatic stress disorder, lives with his daughter in a humble house located by the sea. Together, they live an isolated life and have to confront the challenges of a harsh life. Despite the captain’s deep desire to be a devoted and caring father, he finds himself unable to fulfill his role and connect with his daughter in the way that he longs to. One morning, their lives change forever when an unforeseen event occurs. Whether this event proves to be a newfound source of hope or an additional burden remains to be seen.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/2/7/1/1/1042711-in-the-shadow-of-the-cypress-0-1000-0-1500-crop.jpg?v=fc0874f0a1",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/52/ev/9c/1x/Dar%20Saaye%20Sarv_3-1200-1200-675-675-crop-000000.jpg?v=703b464d0f",
    letterboxd: "https://letterboxd.com/film/in-the-shadow-of-the-cypress/",
  },
  {
    slug: "beautiful-men-2023",
    name: "Beautiful Men",
    tagline: null,
    description:
      "Three balding brothers travel to Istanbul to get a hair transplant. Stuck with each other in a hotel far from home, their insecurities grow faster than their hair.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/3/4/1/8/1043418-beautiful-men-0-1000-0-1500-crop.jpg?v=618a4ac72a",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/5n/e0/dj/v7/beautifuk%20meb-1200-1200-675-675-crop-000000.jpg?v=0b261aa8e2",
    letterboxd: "https://letterboxd.com/film/beautiful-men-2023/",
  },
  {
    slug: "yuck",
    name: "Yuck!",
    tagline: null,
    description:
      "Yuck. Couples kissing on the mouth are gross. And the worst is, you can\u2019t miss them: when people are about to kiss, their lips become all pink and shiny. Little L\u00e9o laughs at them, just like all the kids at the summer camp. But he has a secret he won\u2019t tell his friends: his own mouth has actually begun glistening. And, in reality, L\u00e9o desperately wants to give kissing a try.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/0/3/8/9/6/1103896-yuck-0-1000-0-1500-crop.jpg?v=8dc32066ac",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/em/h6/6o/o3/rUID6M9JLU6DK2c9WXEKgmsG1C6-1200-1200-675-675-crop-000000.jpg?v=79d6ad3660",
    letterboxd: "https://letterboxd.com/film/yuck/",
  },
  {
    slug: "magic-candies",
    name: "Magic Candies",
    tagline: "WHO\u2019S VOICE DO YOU WANT TO HEAR?",
    description:
      "The other kids never ask Dong-Dong to play, but he\u2019s fine just playing marbles on his own. Until one day, he buys a bag of colorful candies and begins to discover new voices and perspectives.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/3/3/6/9/3/1133693-magic-candies-0-1000-0-1500-crop.jpg?v=6d89023b7a",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/wq/cr/i6/2c/2QQUXTZdHdh48K51aZKMlfaD6B1-1200-1200-675-675-crop-000000.jpg?v=ca43363e40",
    letterboxd: "https://letterboxd.com/film/magic-candies/",
  },
  {
    slug: "the-man-who-could-not-remain-silent",
    name: "The Man Who Could Not Remain Silent",
    tagline: null,
    description:
      "The film follows a passenger train traveling from Belgrade in Serbia to Bar in Montenegro. The train is stopped by armed Serbian paramilitary forces at a small station in Štrpci in Bosnia and Herzegovina. Having received a tip off that there are Muslim passengers on the train, they found 19 of them, took them off the train, and executed them shortly after the train departed. About 500 passengers witnessed the event, but no one dared to stand up to them, except for one man, a retired military officer Tomo Buzov, on his way to visit his son.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/6/2/4/0/1/1162401-the-man-who-could-not-remain-silent-0-1000-0-1500-crop.jpg?v=e330d67770",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/9m/dy/7i/wi/ManWhoCouldNotRemainSilent-1200-1200-675-675-crop-000000.jpg?v=d4d7346348",
    letterboxd:
      "https://letterboxd.com/film/the-man-who-could-not-remain-silent/",
  },
  {
    slug: "anuja",
    name: "Anuja",
    tagline: null,
    description:
      "When a gifted 9-year-old girl, Anuja, who works in a garment factory in Delhi, India is offered a once-in-a-lifetime chance to attend school, she is forced to make a heart-wrenching decision that will determine her and her sister Palak\u2019s fate.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/3/2/1/5/6/1232156-anuja-0-1000-0-1500-crop.jpg?v=8f18c1496a",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/anuja/",
  },
  {
    slug: "im-not-a-robot-2023",
    name: "I\u2019m Not a Robot",
    tagline: null,
    description:
      "\u201cDo people think your conduct is aloof?\u201d When the young music producer Lara fails to convince her computer she is not a robot, she has her doubts too. Because no matter how often she identifies the traffic signs and trees in the tests, the computer will not accept her ticks. In panic, she calls her boyfriend for comfort, but this only complicates the situation further, in this absurd comedy full of black humour involving Lara\u2019s existential dilemma.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/6/5/1/3/3/1065133-im-not-a-robot-2023-0-1000-0-1500-crop.jpg?v=a0d7fd168c",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/im-not-a-robot-2023/",
  },
  {
    slug: "a-lien",
    name: "A Lien",
    tagline: null,
    description:
      "On the day of their green card interview, a young couple confronts a dangerous immigration process.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/0/8/7/1/5/1008715-a-lien-0-1000-0-1500-crop.jpg?v=62bc99c3f4",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/a-lien/",
  },
  {
    slug: "the-last-ranger",
    name: "The Last Ranger",
    tagline: null,
    description:
      "When young Litha is introduced to the magic of a game reserve by the last remaining ranger, they are ambushed by poachers. In the ensuing battle to save the rhinos, Litha discovers a terrible secret.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/9/6/9/7/2/1196972-the-last-ranger-0-1000-0-1500-crop.jpg?v=e55b3acc18",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/the-last-ranger/",
  },
  {
    slug: "i-am-ready-warden",
    name: "I Am Ready, Warden",
    tagline: null,
    description:
      "In the days leading up to his execution, Texas death row prisoner John Henry Ramirez seeks redemption from his victim\u2019s son; an elegy about the death penalty where a prisoner seeks forgiveness.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/8/2/3/6/5/1182365-i-am-ready-warden-0-1000-0-1500-crop.jpg?v=9403f97aaf",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/i-am-ready-warden/",
  },
  {
    slug: "incident-2023",
    name: "Incident",
    tagline: null,
    description:
      "Chicago, 2018. A man is killed by police on the street. Through a composite montage of images from surveillance and security footage as well as police body-cams, Incident recreates the event and its consequences, featuring vain justifications, altercations and attempts to avoid blame. Bill Morrison delivers a chilling political investigation in search of the truth.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/9/9/3/1/1/999311-incident-0-1000-0-1500-crop.jpg?v=640b34b79a",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/incident-2023/",
  },
  {
    slug: "death-by-numbers",
    name: "Death by Numbers",
    tagline: null,
    description:
      "Four years after being shot with an AR-15 in her high school, Samantha Fuentes reckons with existential questions of hatred and justice as she prepares to confront her shooter.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/4/5/5/7/6/1245576-death-by-numbers-0-1000-0-1500-crop.jpg?v=a7cf9795a0",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/death-by-numbers/",
  },
  {
    slug: "the-only-girl-in-the-orchestra",
    name: "The Only Girl in the Orchestra",
    tagline: null,
    description:
      "Trailblazing double bassist Orin O’Brien never wanted the spotlight, but when Leonard Bernstein hired her in 1966 as the first female musician in the New York Philarmonic, it was inevitable that she would become the focus of much interest and fascination. Now 87 years old and recently retired, Orin looks back on her remarkable life and career, insisting that a fuss should not be made, much preferring to play a supporting role to the family, students, friends, and colleagues that surround her.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/8/6/2/3/3/1086233-the-only-girl-in-the-orchestra-0-1000-0-1500-crop.jpg?v=d30181e641",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/the-only-girl-in-the-orchestra/",
  },
  {
    slug: "instruments-of-a-beating-heart",
    name: "Instruments of a Beating Heart",
    tagline: null,
    description:
      "First graders in a Tokyo public elementary school are presented with a challenge for the final semester: performing \u201cOde to Joy\u201d at the ceremony for the new incoming first graders. Ayame, who often struggles to keep up with the group, is determined to play a major part \u2014 the big drum.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/6/8/7/5/2/1168752-instruments-of-a-beating-heart-0-1000-0-1500-crop.jpg?v=969772fee8",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/instruments-of-a-beating-heart/",
  },
  {
    slug: "the-six-triple-eight-2024",
    name: "The Six Triple Eight",
    tagline: "They were ordered to provide hope…",
    description:
      "During World War II, the US Army’s only all-Black, all-women battalion takes on an impossible mission: sorting through a three-year backlog of 17 million pieces of mail that hadn’t been delivered to American soldiers and finish within six months.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/5/7/3/2/4/957324-the-six-triple-eight-2024-0-230-0-345-crop.jpg?v=6ea2359b8f",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/9/5/7/3/2/4/tmdb/2iq7ezjTeU8cASeRZCH4cn25TeI-1200-1200-675-675-crop-000000.jpg?v=1f983291fc",
    letterboxd: "https://letterboxd.com/film/the-six-triple-eight-2024/",
  },
];

const receivers = [
  {
    slug: "brady-corbet",
    name: "Brady Corbet",
    image: "https://image.tmdb.org/t/p/w342/chcP7SRLM4HLQzJ4xtfEYCXslUc.jpg",
    letterboxd: "https://letterboxd.com/actor/brady-corbet/",
  },
  {
    slug: "jacques-audiard",
    name: "Jacques Audiard",
    image: "https://image.tmdb.org/t/p/w342/dJ2XCySH5NKZTEEapYK3RaBtL61.jpg",
    letterboxd: "https://letterboxd.com/director/jacques-audiard/",
  },
  {
    slug: "sean-baker",
    name: "Sean Baker",
    image: "https://image.tmdb.org/t/p/w342/wKfNgfRvPhLHMrwuweSwLOmhRzT.jpg",
    letterboxd: "https://letterboxd.com/director/sean-baker/",
  },
  {
    slug: "coralie-fargeat",
    name: "Coralie Fargeat",
    image: "https://image.tmdb.org/t/p/w342/cLoy8QSKNyNOR2Ff9YHAR8NT3sr.jpg",
    letterboxd: "https://letterboxd.com/director/coralie-fargeat/",
  },
  {
    slug: "james-mangold",
    name: "James Mangold",
    image: "https://image.tmdb.org/t/p/w342/pk0GDjn99crNwR4qgCCEokDYd71.jpg",
    letterboxd: "https://letterboxd.com/director/james-mangold/",
  },
  {
    slug: "demi-moore",
    name: "Demi Moore",
    image: "https://image.tmdb.org/t/p/w342/gPgZSodybMFBodw7nKRTALONIr2.jpg",
    letterboxd: "https://letterboxd.com/actor/demi-moore/",
  },
  {
    slug: "mikey-madison",
    name: "Mikey Madison",
    image: "https://image.tmdb.org/t/p/w342/mYvxBOIUmAUjEZqHXBok1rc8eIC.jpg",
    letterboxd: "https://letterboxd.com/actor/mikey-madison/",
  },
  {
    slug: "karla-sofia-gascon",
    name: "Karla Sof\u00eda Gasc\u00f3n",
    image: "https://image.tmdb.org/t/p/w342/kD1HfsMqALsge15QY8PxL3de2t4.jpg",
    letterboxd: "https://letterboxd.com/actor/karla-sofia-gascon/",
  },
  {
    slug: "cynthia-erivo",
    name: "Cynthia Erivo",
    image: "https://image.tmdb.org/t/p/w342/oQcFwHu50upW6Soz4Ycc9iHge1k.jpg",
    letterboxd: "https://letterboxd.com/actor/cynthia-erivo/",
  },
  {
    slug: "fernanda-torres",
    name: "Fernanda Torres",
    image: "https://image.tmdb.org/t/p/w342/dkxdADNwbM7ZLQK5YBNeKBqVJNM.jpg",
    letterboxd: "https://letterboxd.com/actor/fernanda-torres/",
  },
  {
    slug: "adrien-brody",
    name: "Adrien Brody",
    image: "https://image.tmdb.org/t/p/w342/qBc7ahQrpVpcllaZ5hkivsOEb3C.jpg",
    letterboxd: "https://letterboxd.com/actor/adrien-brody/",
  },
  {
    slug: "timothee-chalamet",
    name: "Timoth\u00e9e Chalamet",
    image: "https://image.tmdb.org/t/p/w342/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
    letterboxd: "https://letterboxd.com/actor/timothee-chalamet/",
  },
  {
    slug: "ralph-fiennes",
    name: "Ralph Fiennes",
    image: "https://image.tmdb.org/t/p/w342/tJr9GcmGNHhLVVEH3i7QYbj6hBi.jpg",
    letterboxd: "https://letterboxd.com/actor/ralph-fiennes/",
  },
  {
    slug: "colman-domingo",
    name: "Colman Domingo",
    image: "https://image.tmdb.org/t/p/w342/2tu6T9ugnf82qIMGVKWSb0dvvq5.jpg",
    letterboxd: "https://letterboxd.com/actor/colman-domingo/",
  },
  {
    slug: "sebastian-stan",
    name: "Sebastian Stan",
    image: "https://image.tmdb.org/t/p/w342/nKZgixTbHFXpkzzIpMFdLX98GYh.jpg",
    letterboxd: "https://letterboxd.com/actor/sebastian-stan/",
  },
  {
    slug: "zoe-saldana",
    name: "Zoe Salda\u00f1a",
    image: "https://image.tmdb.org/t/p/w342/snQ1rfO9Bb2LRG9MAOQnn3JXVHy.jpg",
    letterboxd: "https://letterboxd.com/actor/zoe-saldana/",
  },
  {
    slug: "ariana-grande",
    name: "Ariana Grande",
    image: "https://image.tmdb.org/t/p/w342/cslFyOh3sTWDeWXgsxmjJ1uqE0P.jpg",
    letterboxd: "https://letterboxd.com/actor/ariana-grande/",
  },
  {
    slug: "isabella-rossellini",
    name: "Isabella Rossellini",
    image: "https://image.tmdb.org/t/p/w342/z0zojT6nwDxi35HMcXlVpBfuBAU.jpg",
    letterboxd: "https://letterboxd.com/actor/isabella-rossellini/",
  },
  {
    slug: "felicity-jones",
    name: "Felicity Jones",
    image: "https://image.tmdb.org/t/p/w342/gsrb1CuyAQtTVZILtNA5tRnhHbs.jpg",
    letterboxd: "https://letterboxd.com/actor/felicity-jones/",
  },
  {
    slug: "monica-barbaro",
    name: "Monica Barbaro",
    image: "https://image.tmdb.org/t/p/w342/fcujBTiKyZgJzaDenhv5ryo9SyB.jpg",
    letterboxd: "https://letterboxd.com/actor/monica-barbaro/",
  },
  {
    slug: "kieran-culkin",
    name: "Kieran Culkin",
    image: "https://image.tmdb.org/t/p/w342/b5EC4nziLhBRX4GOcYx2BdS3FTt.jpg",
    letterboxd: "https://letterboxd.com/actor/kieran-culkin/",
  },
  {
    slug: "edward-norton",
    name: "Edward Norton",
    image: "https://image.tmdb.org/t/p/w342/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg",
    letterboxd: "https://letterboxd.com/actor/edward-norton/",
  },
  {
    slug: "yura-borisov",
    name: "Yura Borisov",
    image: "https://image.tmdb.org/t/p/w342/zLcD2UmXJG6m3qOQhNZs13SQRIp.jpg",
    letterboxd: "https://letterboxd.com/actor/yura-borisov/",
  },
  {
    slug: "guy-pearce",
    name: "Guy Pearce",
    image: "https://image.tmdb.org/t/p/w342/vTqk6Nh3WgqPubkS23eOlMAwmwa.jpg",
    letterboxd: "https://letterboxd.com/actor/guy-pearce/",
  },
  {
    slug: "jeremy-strong",
    name: "Jeremy Strong",
    image: "https://image.tmdb.org/t/p/w342/jcMhXWICSi4QjQttJVhFSiKVvpF.jpg",
    letterboxd: "https://letterboxd.com/actor/jeremy-strong/",
  },
  {
    name: "El Mal",
    slug: "el-mal",
  },
  {
    name: "Mi Camino",
    slug: "mi-camino",
  },
  {
    name: "The Journey",
    slug: "the-journey",
  },
  {
    name: "Never Too Late",
    slug: "never-too-late",
  },
  {
    name: "Like a Bird",
    slug: "like-a-bird",
  },
];

const nominations = [
  {
    category: "actor-in-a-leading-role",
    nominations: [
      {
        movie: "The Brutalist",
        receiver: "Adrien Brody",
        description: "in",
      },
      {
        movie: "A Complete Unknown",
        receiver: "Timothée Chalamet",
        description: "in",
      },
      { movie: "Conclave", receiver: "Ralph Fiennes", description: "in" },
      {
        movie: "Sing Sing",
        receiver: "Colman Domingo",
        description: "in",
      },
      {
        movie: "The Apprentice",
        receiver: "Sebastian Stan",
        description: "in",
      },
    ],
  },
  {
    category: "actor-in-a-supporting-role",
    nominations: [
      {
        movie: "A Real Pain",
        receiver: "Kieran Culkin",
        description: "in",
      },
      {
        movie: "A Complete Unknown",
        receiver: "Edward Norton",
        description: "in",
      },
      { movie: "Anora", receiver: "Yura Borisov", description: "in" },
      {
        movie: "The Brutalist",
        receiver: "Guy Pearce",
        description: "in",
      },
      {
        movie: "The Apprentice",
        receiver: "Jeremy Strong",
        description: "in",
      },
    ],
  },
  {
    category: "actress-in-a-leading-role",
    nominations: [
      {
        movie: "The Substance",
        receiver: "Demi Moore",
        description: "in",
      },
      { movie: "Anora", receiver: "Mikey Madison", description: "in" },
      {
        movie: "Emilia Pérez",
        receiver: "Karla Sofía Gascón",
        description: "in",
      },
      { movie: "Wicked", receiver: "Cynthia Erivo", description: "in" },
      {
        movie: "I’m Still Here",
        receiver: "Fernanda Torres",
        description: "in",
      },
    ],
  },
  {
    category: "actress-in-a-supporting-role",
    nominations: [
      {
        movie: "Emilia Pérez",
        receiver: "Zoe Saldaña",
        description: "in",
      },
      { movie: "Wicked", receiver: "Ariana Grande", description: "in" },
      {
        movie: "Conclave",
        receiver: "Isabella Rossellini",
        description: "in",
      },
      {
        movie: "The Brutalist",
        receiver: "Felicity Jones",
        description: "in",
      },
      {
        movie: "A Complete Unknown",
        receiver: "Monica Barbaro",
        description: "in",
      },
    ],
  },
  {
    category: "animated-feature-film",
    nominations: [
      { movie: "The Wild Robot", description: "" },
      { movie: "Flow", description: "" },
      { movie: "Inside Out 2", description: "" },
      { movie: "Wallace & Gromit: Vengeance Most Fowl", description: "" },
      { movie: "Memoir of a Snail", description: "" },
    ],
  },
  {
    category: "cinematography",
    nominations: [
      { movie: "The Brutalist", description: "" },
      { movie: "Nosferatu", description: "" },
      { movie: "Dune: Part Two", description: "" },
      { movie: "Maria", description: "" },
      { movie: "Emilia Pérez", description: "" },
    ],
  },
  {
    category: "costume-design",
    nominations: [
      { movie: "Wicked", description: "" },
      { movie: "Nosferatu", description: "" },
      { movie: "Conclave", description: "" },
      { movie: "Gladiator II", description: "" },
      { movie: "A Complete Unknown", description: "" },
    ],
  },
  {
    category: "directing",
    nominations: [
      {
        movie: "The Brutalist",
        receiver: "Brady Corbet",
        description: "for",
      },
      {
        movie: "Emilia Pérez",
        receiver: "Jacques Audiard",
        description: "for",
      },
      { movie: "Anora", receiver: "Sean Baker", description: "for" },
      {
        movie: "The Substance",
        receiver: "Coralie Fargeat",
        description: "for",
      },
      {
        movie: "A Complete Unknown",
        receiver: "James Mangold",
        description: "for",
      },
    ],
  },
  {
    category: "documentary-feature-film",
    nominations: [
      { movie: "No Other Land", description: "" },
      { movie: "Sugarcane", description: "" },
      { movie: "Soundtrack to a Coup d’État", description: "" },
      { movie: "Black Box Diaries", description: "" },
      { movie: "Porcelain War", description: "" },
    ],
  },
  {
    category: "documentary-short-film",
    nominations: [
      { movie: "Incident", description: "" },
      { movie: "I Am Ready, Warden", description: "" },
      { movie: "Death by Numbers", description: "" },
      { movie: "The Only Girl in the Orchestra", description: "" },
      { movie: "Instruments of a Beating Heart", description: "" },
    ],
  },
  {
    category: "film-editing",
    nominations: [
      { movie: "Conclave", description: "" },
      { movie: "Anora", description: "" },
      { movie: "Emilia Pérez", description: "" },
      { movie: "The Brutalist", description: "" },
      { movie: "Wicked", description: "" },
    ],
  },
  {
    category: "international-feature-film",
    nominations: [
      { movie: "Emilia Pérez", description: "From France" },
      { movie: "I’m Still Here", description: "From Brazil" },
      { movie: "The Seed of the Sacred Fig", description: "From Germany" },
      { movie: "Flow", description: "From Latvia" },
      { movie: "The Girl with the Needle", description: "From Denmark" },
    ],
  },
  {
    category: "makeup-and-hairstyling",
    nominations: [
      { movie: "The Substance", description: "" },
      { movie: "Wicked", description: "" },
      { movie: "Nosferatu", description: "" },
      { movie: "A Different Man", description: "" },
      { movie: "Emilia Pérez", description: "" },
    ],
  },
  {
    category: "music-original-score",
    nominations: [
      { movie: "The Brutalist", description: "" },
      { movie: "Conclave", description: "" },
      { movie: "Emilia Pérez", description: "" },
      { movie: "The Wild Robot", description: "" },
      { movie: "Wicked", description: "" },
    ],
  },
  {
    category: "music-original-song",
    nominations: [
      { movie: "Emilia Pérez", receiver: "El Mal", description: "from" },
      {
        movie: "Emilia Pérez",
        receiver: "Mi Camino",
        description: "from",
      },
      {
        movie: "The Six Triple Eight",
        receiver: "The Journey",
        description: "from",
      },
      {
        movie: "Elton John: Never Too Late",
        receiver: "Never Too Late",
        description: "from",
      },
      { movie: "Sing Sing", receiver: "Like a Bird", description: "from" },
    ],
  },
  {
    category: "best-picture",
    nominations: [
      { movie: "Conclave", description: "" },
      { movie: "Emilia Pérez", description: "" },
      { movie: "Anora", description: "" },
      { movie: "The Brutalist", description: "" },
      { movie: "Wicked", description: "" },
      { movie: "A Complete Unknown", description: "" },
      { movie: "Dune: Part Two", description: "" },
      { movie: "The Substance", description: "" },
      { movie: "Nickel Boys", description: "" },
      { movie: "I’m Still Here", description: "" },
    ],
  },
  {
    category: "production-design",
    nominations: [
      { movie: "Wicked", description: "" },
      { movie: "The Brutalist", description: "" },
      { movie: "Dune: Part Two", description: "" },
      { movie: "Conclave", description: "" },
      { movie: "Nosferatu", description: "" },
    ],
  },
  {
    category: "animated-short-film",
    nominations: [
      { movie: "Wander to Wonder", description: "" },
      { movie: "Beautiful Men", description: "" },
      { movie: "In the Shadow of the Cypress", description: "" },
      { movie: "Yuck!", description: "" },
      { movie: "Magic Candies", description: "" },
    ],
  },
  {
    category: "live-action-short-film",
    nominations: [
      { movie: "The Man Who Could Not Remain Silent", description: "" },
      { movie: "Anuja", description: "" },
      { movie: "I’m Not a Robot", description: "" },
      { movie: "A Lien", description: "" },
      { movie: "The Last Ranger", description: "" },
    ],
  },
  {
    category: "sound",
    nominations: [
      { movie: "Dune: Part Two", description: "" },
      { movie: "Wicked", description: "" },
      { movie: "A Complete Unknown", description: "" },
      { movie: "Emilia Pérez", description: "" },
      { movie: "The Wild Robot", description: "" },
    ],
  },
  {
    category: "visual-effects",
    nominations: [
      { movie: "Dune: Part Two", description: "" },
      { movie: "Kingdom of the Planet of the Apes", description: "" },
      { movie: "Better Man", description: "" },
      { movie: "Wicked", description: "" },
      { movie: "Alien: Romulus", description: "" },
    ],
  },
  {
    category: "writing-adapted-screenplay",
    nominations: [
      { movie: "Conclave", description: "" },
      { movie: "Emilia Pérez", description: "" },
      { movie: "A Complete Unknown", description: "" },
      { movie: "Sing Sing", description: "" },
      { movie: "Nickel Boys", description: "" },
    ],
  },
  {
    category: "writing-original-screenplay",
    nominations: [
      { movie: "Anora", description: "" },
      { movie: "The Brutalist", description: "" },
      { movie: "A Real Pain", description: "" },
      { movie: "The Substance", description: "" },
      { movie: "September 5", description: "" },
    ],
  },
];

void (async () => {
  await db
    .insert(dbtCategory)
    .values(categories)
    .onConflictDoNothing({ target: dbtCategory.slug });
  console.log("Inserted categories: ", { categories });

  await db
    .insert(dbtMovie)
    .values(movies)
    .onConflictDoNothing({ target: dbtMovie.slug });
  console.log("Inserted movies: ", { movies });

  await db
    .insert(dbtReceiver)
    .values(receivers)
    .onConflictDoNothing({ target: dbtReceiver.slug });
  console.log("Inserted movies: ", { receivers });

  await db
    .insert(dbtCategoryTypesPoints)
    .values(points)
    .onConflictDoNothing({ target: dbtCategoryTypesPoints.categoryType });
  console.log("Inserted points: ", { points });

  const dbCategories = await db.query.dbtCategory.findMany();
  const dbMovies = await db.query.dbtMovie.findMany();
  const dbReceivers = await db.query.dbtReceiver.findMany();

  const categoryMap = new Map(dbCategories.map((c) => [c.slug, c]));
  const movieMap = new Map(dbMovies.map((m) => [m.name, m]));
  const receiverMap = new Map(dbReceivers.map((r) => [r.name, r]));

  for (const categoryGroup of nominations) {
    const category = categoryMap.get(categoryGroup.category);

    if (!category) {
      console.error("Category not found", categoryGroup.category);
      continue;
    }

    for (const nom of categoryGroup.nominations) {
      const movie = movieMap.get(nom.movie);

      if (!movie) {
        console.error("Movie not found", nom.movie);
        continue;
      }

      let receiverId = null;
      if ("receiver" in nom) {
        const receiver = receiverMap.get(nom.receiver);
        if (!receiver) {
          console.error("Receiver not found", nom.receiver);
          continue;
        }
        receiverId = receiver.id;
      }

      await db
        .insert(dbtNomination)
        .values({
          category: category.id,
          movie: movie.id,
          receiver: receiverId,
          description: nom.description,
          isWinner: false,
        })
        .onConflictDoNothing();
    }
  }
  console.log("Inserted nominations");
})();

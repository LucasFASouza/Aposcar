import { eq, ne } from "drizzle-orm";
import { db } from "@/server/db";
import {
  dbtEdition,
  dbtCategory,
  dbtMovie,
  dbtReceiver,
  dbtNomination,
} from "@/server/db/schema/aposcar";

const movies = [
  {
    slug: "sinners-2025",
    name: "Sinners",
    tagline: "DANCE WITH THE DEVIL.",
    description:
      "Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/6/6/0/0/1116600-sinners-2025-0-230-0-345-crop.jpg?v=5996b7d555",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/x1/ne/1h/4u/sinners-1200-1200-675-675-crop-000000.jpg?v=60c0af98f0",
    letterboxd: "https://letterboxd.com/film/sinners-2025/",
  },
  {
    slug: "one-battle-after-another",
    name: "One Battle After Another",
    tagline: "SOME SEARCH FOR BATTLE, OTHERS ARE BORN INTO IT.",
    description:
      "When their evil nemesis resurfaces after 16 years, a band of ex-revolutionaries reunite to rescue the daughter of one of their own.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-230-0-345-crop.jpg?v=d27c4cc662",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/9/5/1/2/7/7/tmdb/ev06XwWLSoTG2DkLlsllAhlWGsk-1200-1200-675-675-crop-000000.jpg?v=cf6bcc5601",
    letterboxd: "https://letterboxd.com/film/one-battle-after-another/",
  },
  {
    slug: "marty-supreme",
    name: "Marty Supreme",
    tagline: "DREAM BIG.",
    description:
      "In 1950s New York, Marty Mauser, a young man with a dream no one respects, goes to hell and back in pursuit of greatness.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/9/7/4/9/9/1197499-marty-supreme-0-460-0-690-crop.jpg?v=b14a26bb43",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/9v/j7/mm/yn/marty-sup-1200-1200-675-675-crop-000000.jpg?v=4c4675acde",
    letterboxd: "https://letterboxd.com/film/marty-supreme/",
  },
  {
    slug: "sentimental-value-2025",
    name: "Sentimental Value",
    tagline: null,
    description:
      "Sisters Nora and Agnes reunite with their estranged father, the charismatic Gustav, a once-renowned director who offers stage actress Nora a role in what he hopes will be his comeback film. When Nora turns it down, she soon discovers he has given her part to an eager young Hollywood star.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/1/3/3/5/7/1013357-sentimental-value-2025-0-230-0-345-crop.jpg?v=e89e64a309",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/6v/ar/g0/nb/w7s8q7sXbqao6Sp907kxSzUMpL1-1200-1200-675-675-crop-000000.jpg?v=b6153fb694",
    letterboxd: "https://letterboxd.com/film/sentimental-value-2025/",
  },
  {
    slug: "hamnet",
    name: "Hamnet",
    tagline: "KEEP YOUR HEART OPEN.",
    description:
      "The powerful story of love and loss that inspired the creation of Shakespeare's timeless masterpiece, Hamlet.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/7/2/2/3/2/772232-hamnet-0-230-0-345-crop.jpg?v=631489314d",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/7/7/2/2/3/2/tmdb/yt9m5CiU2MZkQoNl1kqLPODNR4t-1200-1200-675-675-crop-000000.jpg?v=a019dfb99b",
    letterboxd: "https://letterboxd.com/film/hamnet/",
  },
  {
    slug: "frankenstein-2025",
    name: "Frankenstein",
    tagline: "ONLY MONSTERS PLAY GOD.",
    description:
      "Dr. Victor Frankenstein, a brilliant but egotistical scientist, brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/5/8/1/0/0/958100-frankenstein-2025-0-230-0-345-crop.jpg?v=49a1ca2305",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/0x/nu/nk/d4/frankenstein-2025-1200-1200-675-675-crop-000000.jpg?v=dd7366dc77",
    letterboxd: "https://letterboxd.com/film/frankenstein-2025/",
  },
  {
    slug: "bugonia",
    name: "Bugonia",
    tagline: "IT ALL STARTS WITH SOMETHING MAGNIFICENT.",
    description:
      "Two conspiracy obsessed young men kidnap the high-powered CEO of a major company, convinced that she is an alien intent on destroying planet Earth.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/6/2/5/4/0/0/625400-bugonia-0-230-0-345-crop.jpg?v=4c6649150e",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/jf/rv/eq/r2/bug-1200-1200-675-675-crop-000000.jpg?v=9227b4cd8a",
    letterboxd: "https://letterboxd.com/film/bugonia/",
  },
  {
    slug: "train-dreams",
    name: "Train Dreams",
    tagline: null,
    description:
      "A logger leads a life of quiet grace as he experiences love and loss during an era of monumental change in early 20th-century America.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/2/5/3/8/3/1125383-train-dreams-0-230-0-345-crop.jpg?v=55740bb5b4",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/1/2/5/3/8/3/tmdb/kUAYBysrwhimuz5wYO6GgefRdD1-1200-1200-675-675-crop-000000.jpg?v=b8ca2f5113",
    letterboxd: "https://letterboxd.com/film/train-dreams/",
  },
  {
    slug: "the-secret-agent-2025",
    name: "The Secret Agent",
    tagline: "BRAZIL 1977, A TIME OF GREAT MISCHIEF.",
    description:
      "In 1977 Brazil, technology specialist Marcelo, fleeing a mysterious past, returns to Recife in search of peace, but realizes the city is far from the refuge he seeks.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/0/4/3/4/8/1104348-the-secret-agent-2025-0-230-0-345-crop.jpg?v=3bcd2a3e02",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/1/0/4/3/4/8/tmdb/NPJlNm5PixViH4dmH7pBnAgkzy-1200-1200-675-675-crop-000000.jpg?v=a48f74bf3c",
    letterboxd: "https://letterboxd.com/film/the-secret-agent-2025/",
  },
  {
    slug: "f1",
    name: "F1",
    tagline: "LET'S RIDE.",
    description:
      "Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/1/7/9/7/7/817977-f1-the-movie-0-230-0-345-crop.jpg?v=f5ae2b99b9",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/j8/ma/xb/4d/f1-1200-1200-675-675-crop-000000.jpg?v=4d478b1250",
    letterboxd: "https://letterboxd.com/film/f1/",
  },
  {
    slug: "blue-moon-2025",
    name: "Blue Moon",
    tagline: "FORGOTTEN BUT NOT GONE.",
    description:
      "On the evening of March 31, 1943, legendary lyricist Lorenz Hart confronts his shattered self-confidence in Sardi's bar as his former collaborator Richard Rodgers celebrates the opening night of his ground-breaking hit musical 'Oklahoma!'.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/8/1/4/6/3/1181463-blue-moon-2025-0-230-0-345-crop.jpg?v=e7b58cae0d",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/lg/8y/sz/73/BlueMoon-1200-1200-675-675-crop-000000.jpg?v=27045d8cb1",
    letterboxd: "https://letterboxd.com/film/blue-moon-2025/",
  },
  {
    slug: "if-i-had-legs-id-kick-you",
    name: "If I Had Legs I'd Kick You",
    tagline: "EVERYTHING IS UNDER CONTROL.",
    description:
      "With her life crashing down around her, Linda attempts to navigate her child's mysterious illness, her absent husband, a missing person, and an increasingly hostile relationship with her therapist.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/4/6/5/2/2/1046522-if-i-had-legs-id-kick-you-0-230-0-345-crop.jpg?v=831a0c76c9",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/0/4/6/5/2/2/tmdb/p5S84MJVbPQziWnoapexAAo8xwt-1200-1200-675-675-crop-000000.jpg?v=9fac81f036",
    letterboxd: "https://letterboxd.com/film/if-i-had-legs-id-kick-you/",
  },
  {
    slug: "song-sung-blue-2025",
    name: "Song Sung Blue",
    tagline: "INSPIRED BY A LEGEND. BOUND BY A DREAM.",
    description:
      "Based on a true story, two down-on-their-luck musicians form a joyous Neil Diamond tribute band, proving it's never too late to find love and follow your dreams.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/5/7/9/2/3/1257923-song-sung-blue-2025-0-230-0-345-crop.jpg?v=cbd714fcd7",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/5/7/9/2/3/tmdb/chauR8wE7aKcCR02xvkUtglKfP5-1200-1200-675-675-crop-000000.jpg?v=aac46d58a5",
    letterboxd: "https://letterboxd.com/film/song-sung-blue-2025/",
  },
  {
    slug: "weapons-2025",
    name: "Weapons",
    tagline:
      "LAST NIGHT AT 2:17 AM, EVERY CHILD FROM MRS. GANDY'S CLASS WOKE UP, GOT OUT OF BED, WENT DOWNSTAIRS, OPENED THE FRONT DOOR, WALKED INTO THE DARK ...AND THEY NEVER CAME BACK.",
    description:
      "When all but one child from the same class mysteriously vanish on the same night at exactly the same time, a community is left questioning who or what is behind their disappearance.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/7/2/1/0/9/972109-weapons-2025-0-230-0-345-crop.jpg?v=8100270337",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/l7/cx/wv/3u/sQUvdgUcAX3YR5otU1RuCkIPaJX-1200-1200-675-675-crop-000000.jpg?v=0d9de97e26",
    letterboxd: "https://letterboxd.com/film/weapons-2025/",
  },
  {
    slug: "it-was-just-an-accident",
    name: "It Was Just an Accident",
    tagline: null,
    description:
      "Vahid, an Azerbaijani auto mechanic, was once imprisoned by Iranian authorities. During his sentence, he was interrogated blindfolded. One day, a man named Eqbal enters his workshop. His prosthetic leg creaks, and Vahid thinks he recognizes one of his former torturers.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/3/3/4/9/8/1333498-it-was-just-an-accident-0-230-0-345-crop.jpg?v=d1e92cf746",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/ir/k9/a2/zf/xbD4brQDBMPhh3Xv459m4XmVJG-1200-1200-675-675-crop-000000.jpg?v=6b98e5118d",
    letterboxd: "https://letterboxd.com/film/it-was-just-an-accident/",
  },
  {
    slug: "avatar-fire-and-ash",
    name: "Avatar: Fire and Ash",
    tagline: "THE WORLD OF PANDORA WILL CHANGE FOREVER.",
    description:
      "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/0/0/0/7/70007-avatar-fire-and-ash-0-230-0-345-crop.jpg?v=5d2f8b35b1",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/j0/xq/n1/lt/pN3eaCl3sqwrerU8UNdp40F2mK0-1200-1200-675-675-crop-000000.jpg?v=f01bc937c1",
    letterboxd: "https://letterboxd.com/film/avatar-fire-and-ash/",
  },
  {
    slug: "sirat-2025",
    name: "Sirāt",
    tagline: null,
    description:
      "A man and his son arrive at a rave lost in the mountains of Morocco. They are looking for Marina, their daughter and sister, who disappeared months ago at another rave. Driven by fate, they decide to follow a group of ravers in search of one last party, in hopes Marina will be there.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/3/7/7/7/7/1037777-sirat-2025-0-230-0-345-crop.jpg?v=1660cb1f29",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/0/3/7/7/7/7/tmdb/58MtlV69aVMskYj7X3aoi1Q0ItD-1200-1200-675-675-crop-000000.jpg?v=d9ed433926",
    letterboxd: "https://letterboxd.com/film/sirat-2025/",
  },
  {
    slug: "the-lost-bus",
    name: "The Lost Bus",
    tagline: "INSPIRED BY A TRUE STORY OF SURVIVAL.",
    description:
      "A determined father risks everything to rescue a dedicated teacher and her students from a raging wildfire.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/9/6/6/2/1119662-the-lost-bus-0-230-0-345-crop.jpg?v=1bdbef0371",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/99/zv/am/6u/cpIdBoUOmkD3ldHfxFwJQvmHxGR-1200-1200-675-675-crop-000000.jpg?v=84af545543",
    letterboxd: "https://letterboxd.com/film/the-lost-bus/",
  },
  {
    slug: "jurassic-world-rebirth",
    name: "Jurassic World Rebirth",
    tagline: "A NEW ERA IS BORN.",
    description: "",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/7/9/2/6/1117926-jurassic-world-rebirth-0-230-0-345-crop.jpg?v=1dbc19cf2f",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/bg/pz/v4/24/xyAvU9WrfQLCCU2VxLF4t7EMXEF-1200-1200-675-675-crop-000000.jpg?v=5e5655a11d",
    letterboxd: "https://letterboxd.com/film/jurassic-world-rebirth/",
  },
  {
    slug: "the-smashing-machine-2025",
    name: "The Smashing Machine",
    tagline: "THE UNFORGETTABLE TRUE STORY OF A UFC LEGEND.",
    description:
      "In the late 1990s, up-and-coming mixed martial artist Mark Kerr aspires to become the greatest fighter in the world. However, he must also battle his opioid dependence and a volatile relationship with his girlfriend Dawn.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/6/8/0/7/3/9/680739-the-smashing-machine-2025-0-230-0-345-crop.jpg?v=e1c8e23118",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/e3/u7/rf/iz/nWKTa7m93rxUeCorDgHXGawqOEy-1200-1200-675-675-crop-000000.jpg?v=941219490a",
    letterboxd: "https://letterboxd.com/film/the-smashing-machine-2025/",
  },
  {
    slug: "kokuho",
    name: "Kokuho",
    tagline: null,
    description:
      "Nagasaki, 1964: Following the death of his yakuza father, 15-year-old Kikuo is taken under the wing of a famous kabuki actor. Alongside Shunsuke, the actor's only son, he decides to dedicate himself to this traditional form of theatre. For decades, the two young men grow and evolve together - and one will become the greatest Japanese master of the art of kabuki.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/6/5/6/5/8/1265658-kokuho-0-230-0-345-crop.jpg?v=662ff79da5",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/6/5/6/5/8/tmdb/3C8yAIuXlH4BGCpTwEetIv0VBt8-1200-1200-675-675-crop-000000.jpg?v=8687754cc0",
    letterboxd: "https://letterboxd.com/film/kokuho/",
  },
  {
    slug: "the-ugly-stepsister",
    name: "The Ugly Stepsister",
    tagline: "IF THE SHOE DOESN'T FIT...",
    description:
      "In a fairy-tale kingdom where beauty is a brutal business, Elvira battles to compete with her incredibly beautiful stepsister, and she will go to any length to catch the prince's eye.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/6/7/6/5/7/1167657-the-ugly-stepsister-0-230-0-345-crop.jpg?v=a5e7b4de55",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/1/6/7/6/5/7/tmdb/rw81acrkXXu1JyY1BdRPZP2KkdS-1200-1200-675-675-crop-000000.jpg?v=478e4ed7e9",
    letterboxd: "https://letterboxd.com/film/the-ugly-stepsister/",
  },
  {
    slug: "viva-verdi",
    name: "Viva Verdi!",
    tagline: "... LIFE'S 'THIRD ACT' MAY BE THE BEST ONE AFTER ALL!",
    description: "",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/4/7/2/6/1/1247261-viva-verdi-0-230-0-345-crop.jpg?v=494d86481d",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/viva-verdi/",
  },
  {
    slug: "diane-warren-relentless",
    name: "Diane Warren: Relentless",
    tagline: "HITMAKER. LEGEND. PAIN IN THE ASS.",
    description:
      "An intimate look at the life, career and process of one of the most accomplished songwriters of all time, Diane Warren.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/4/2/4/3/8/742438-diane-warren-relentless-0-230-0-345-crop.jpg?v=54a3fa99b7",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/7/4/2/4/3/8/tmdb/wEOqE5UyPqouk88mPxxUQViUaiM-1200-1200-675-675-crop-000000.jpg?v=a87ad6e64e",
    letterboxd: "https://letterboxd.com/film/diane-warren-relentless/",
  },
  {
    slug: "kpop-demon-hunters",
    name: "KPop Demon Hunters",
    tagline: "THEY SING. THEY DANCE. THEY BATTLE DEMONS.",
    description:
      "When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums, they're using their secret powers to protect their fans from supernatural threats.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/2/0/9/5/3/720953-kpop-demon-hunters-0-230-0-345-crop.jpg?v=10b7464274",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/7/2/0/9/5/3/tmdb/n7z6rHymrRdZL0ZDZS4aL1JUbLq-1200-1200-675-675-crop-000000.jpg?v=6902b5e56e",
    letterboxd: "https://letterboxd.com/film/kpop-demon-hunters/",
  },
  {
    slug: "zootopia-2",
    name: "Zootopia 2",
    tagline: "ZOOTOPIA WILL BE CHANGED FURRREVER...",
    description:
      "After cracking the biggest case in Zootopia's history, rookie cops Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery when Gary De'Snake arrives and turns the animal metropolis upside down. To crack the case, Judy and Nick must go undercover to unexpected new parts of town, where their growing partnership is tested like never before.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/7/7/3/4/2/977342-zootopia-2-0-230-0-345-crop.jpg?v=00a15a97bc",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/9/7/7/3/4/2/tmdb/4UgPOQ5luKfa5mM2MXCR34Mb71v-1200-1200-675-675-crop-000000.jpg?v=1694916524",
    letterboxd: "https://letterboxd.com/film/zootopia-2/",
  },
  {
    slug: "arco",
    name: "Arco",
    tagline: "WHAT IF RAINBOWS WERE PEOPLE FROM THE FUTURE TRAVELING IN TIME?",
    description:
      "Arco, ten years old, lives in a far future. During his first flight in his rainbow suit, he loses control and falls in the past. Iris, a little girl his age from 2075, saw him fall. She rescues him and tries by all means to send him back to his era.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/7/2/1/5/6/6/721566-arco-0-230-0-345-crop.jpg?v=ec3d530c34",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/7/2/1/5/6/6/tmdb/2xZqXvixybEFg6GQAoSYPJu9gHS-1200-1200-675-675-crop-000000.jpg?v=bda3a8ea57",
    letterboxd: "https://letterboxd.com/film/arco/",
  },
  {
    slug: "little-amelie-or-the-character-of-rain",
    name: "Little Amélie or the Character of Rain",
    tagline:
      "WHEN YOU'RE THREE YEARS OLD, YOU SEE EVERYTHING AND UNDERSTAND NOTHING.",
    description:
      "The world is a perplexing, peaceful mystery to Amélie until a miraculous encounter with chocolate ignites her wild sense of curiosity. As she develops a deep attachment to her family's housekeeper, Nishio-san, Amélie discovers the wonders of nature as well as the emotional truths hidden beneath the surface of her family's idyllic life as foreigners in post-war Japan.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/6/0/6/2/9/8/606298-little-amelie-or-the-character-of-rain-0-230-0-345-crop.jpg?v=4440475e1e",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/6/0/6/2/9/8/tmdb/2WCpiFmRqXyu5y7WoZjEa3CJbiI-1200-1200-675-675-crop-000000.jpg?v=d780e95ba5",
    letterboxd:
      "https://letterboxd.com/film/little-amelie-or-the-character-of-rain/",
  },
  {
    slug: "elio",
    name: "Elio",
    tagline: "THEY ASKED FOR OUR LEADER. THEY GOT... HIM.",
    description:
      "Elio, a space fanatic with an active imagination, finds himself on a cosmic misadventure where he must form new bonds with eccentric alien lifeforms, navigate a crisis of intergalactic proportions and somehow discover who he is truly meant to be.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/9/2/1/5/7/5/921575-elio-0-230-0-345-crop.jpg?v=d3f4e92f5e",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/9/2/1/5/7/5/tmdb/bvATKuxz9Wu53caHUJ7SP38gFQ3-1200-1200-675-675-crop-000000.jpg?v=55bb4030c6",
    letterboxd: "https://letterboxd.com/film/elio/",
  },
  {
    slug: "the-voice-of-hind-rajab",
    name: "The Voice of Hind Rajab",
    tagline: null,
    description:
      "January 29, 2024. Red Crescent volunteers receive an emergency call. A five-year old girl is trapped in a car under fire in Gaza, pleading for rescue. While trying to keep her on the line, they do everything they can to get an ambulance to her. Her name was Hind Rajab.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/5/7/4/0/2/1357402-the-voice-of-hind-rajab-0-230-0-345-crop.jpg?v=c5d8abe27e",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/qq/ee/vo/9k/alLKink1suM5FoLrXKBxnJzPmE8-1200-1200-675-675-crop-000000.jpg?v=4053f8617c",
    letterboxd: "https://letterboxd.com/film/the-voice-of-hind-rajab/",
  },
  {
    slug: "the-perfect-neighbour",
    name: "The Perfect Neighbor",
    tagline: null,
    description:
      "Police bodycam footage reveals how a long-running neighborhood dispute turned fatal in this documentary about fear, prejudice and Stand Your Ground laws.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/8/4/1/5/7/1284157-the-perfect-neighbor-2025-0-230-0-345-crop.jpg?v=f3b31c60df",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/8/4/1/5/7/tmdb/6sUUl2zUUw6IyW3J2zB2KGJys3d-1200-1200-675-675-crop-000000.jpg?v=de49e5fe4b",
    letterboxd: "https://letterboxd.com/film/the-perfect-neighbour/",
  },
  {
    slug: "the-alabama-solution",
    name: "The Alabama Solution",
    tagline: "THE TRUTH FROM THE INSIDE OUT.",
    description:
      "Incarcerated men defy the odds to expose a cover-up in one of America's deadliest prison systems.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/9/5/2/0/6/1295206-the-alabama-solution-0-230-0-345-crop.jpg?v=1466f00681",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/vs/qd/41/dr/AlabamaSolution-1200-1200-675-675-crop-000000.jpg?v=5ac97d2972",
    letterboxd: "https://letterboxd.com/film/the-alabama-solution/",
  },
  {
    slug: "cutting-through-rocks",
    name: "Cutting Through Rocks",
    tagline: null,
    description:
      "37-year-old Sara Shahverdi, a motorcycle riding, land owning, former midwife-turned-fierce citizen advocate and recent divorcée, just won a landslide local election in her remote Iranian village and everyone has an opinion about it.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/8/4/1/6/5/1284165-cutting-through-rocks-0-230-0-345-crop.jpg?v=51ce072b4d",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/5j/io/e5/72/CuttingThroughRocks-1200-1200-675-675-crop-000000.jpg?v=5da7127d76",
    letterboxd: "https://letterboxd.com/film/cutting-through-rocks/",
  },
  {
    slug: "mr-nobody-against-putin",
    name: "Mr. Nobody Against Putin",
    tagline: null,
    description:
      "As Russia launches its full-scale invasion of Ukraine, primary schools across Russia's hinterlands are transformed into recruitment stages for the war. Facing the ethical dilemma of working in a system defined by propaganda and violence, a brave teacher goes undercover to film what's really happening in his own school.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/7/7/5/4/5/1277545-mr-nobody-against-putin-0-230-0-345-crop.jpg?v=e15d911787",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/7/7/5/4/5/tmdb/kRwY6bvMUckRY67XAQQ7CpEwTtf-1200-1200-675-675-crop-000000.jpg?v=acd590f28b",
    letterboxd: "https://letterboxd.com/film/mr-nobody-against-putin/",
  },
  {
    slug: "come-see-me-in-the-good-light",
    name: "Come See Me in the Good Light",
    tagline: "A LOVE STORY IN THE FACE OF LOSS.",
    description:
      "In an intimate and joyful story of love in the face of loss, celebrated poets Andrea Gibson and Megan Falley find strength—and unexpected hilarity—in what might be their final year together.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/8/4/1/5/4/1284154-come-see-me-in-the-good-light-0-230-0-345-crop.jpg?v=f18de047d6",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/8/4/1/5/4/tmdb/x0FZZWBE7Sp5Vz5ncn4wb8JyG5c-1200-1200-675-675-crop-000000.jpg?v=5274d03f4b",
    letterboxd: "https://letterboxd.com/film/come-see-me-in-the-good-light/",
  },
  {
    slug: "butterfly-2024-1",
    name: "Butterfly",
    tagline: null,
    description:
      "A man swims in the sea. This brings back memories. They are all connected to water, from his early childhood to his adult life. This will be the story of his last swim.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/1/6/5/6/2/1116562-butterfly-2024-1-0-230-0-345-crop.jpg?v=bca7af4602",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/7q/39/ta/t8/Butterfly1-1200-1200-675-675-crop-000000.jpg?v=bfbdd846c2",
    letterboxd: "https://letterboxd.com/film/butterfly-2024-1/",
  },
  {
    slug: "forevergreen",
    name: "Forevergreen",
    tagline: null,
    description:
      "An orphaned bear cub finds a home with a fatherly evergreen tree, until his hunger for trash leads him to danger.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/5/4/8/0/0/1354800-forevergreen-0-230-0-345-crop.jpg?v=c951710c3d",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/64/5l/x5/ke/forevergreen_header_2-1200-1200-675-675-crop-000000.jpg?v=5e90e0b3da",
    letterboxd: "https://letterboxd.com/film/forevergreen/",
  },
  {
    slug: "the-girl-who-cried-pearls",
    name: "The Girl Who Cried Pearls",
    tagline: null,
    description:
      "A haunting fable about a girl overwhelmed by sorrow, the boy who loves her, and how greed leads good hearts to wicked deeds.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/0/2/9/1/8/8/1029188-the-girl-who-cried-pearls-0-230-0-345-crop.jpg?v=5181dcae54",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/as/ek/9d/vs/girl-1200-1200-675-675-crop-000000.jpg?v=80557a5136",
    letterboxd: "https://letterboxd.com/film/the-girl-who-cried-pearls/",
  },
  {
    slug: "the-three-sisters-2024",
    name: "The Three Sisters",
    tagline: null,
    description:
      "Three sisters live a lonely life on an isolated island, each in their own small house. One day, circumstances develop in such a way that they are forced to rent out one of their houses.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/8/4/5/8/6/1184586-the-three-sisters-2024-0-230-0-345-crop.jpg?v=1e19a1029a",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/the-three-sisters-2024/",
  },
  {
    slug: "retirement-plan",
    name: "Retirement Plan",
    tagline: null,
    description:
      "At apathy with his life, Ray dreams of the beauty and joy he will find in retirement.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/9/7/2/9/9/1197299-retirement-plan-0-230-0-345-crop.jpg?v=475876741f",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/y0/jy/fk/mu/RetirementPlan_JK_Still_Hike_Medium_v01_HighRes-1200-1200-675-675-crop-000000.jpg?v=1a4bdce61a",
    letterboxd: "https://letterboxd.com/film/retirement-plan/",
  },
  {
    slug: "butchers-stain",
    name: "Butcher's Stain",
    tagline: null,
    description:
      "The story follows Samir, an Arab butcher falsely accused by his manager of removing hostage posters, forcing him to fight for his job and innocence amidst rising prejudice.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/4/3/3/2/4/3/1433243-butchers-stain-0-230-0-345-crop.jpg?v=dd8fce114e",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/butchers-stain/",
  },
  {
    slug: "a-friend-of-dorothy-2025",
    name: "A Friend of Dorothy",
    tagline: null,
    description:
      "Dorothy is a lonely widow whose body is failing, but her mind remains as bright as ever. When 17-year-old JJ accidentally kicks his football into her garden, he upends Dorothy's daily routine of pills, prunes, and crosswords, and an unlikely friendship blossoms. Despite being worlds apart in every way, the two come to find they have more in common than they could ever imagine.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/4/7/4/7/1/1347471-a-friend-of-dorothy-2025-0-230-0-345-crop.jpg?v=d8b8998e8f",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/a-friend-of-dorothy-2025/",
  },
  {
    slug: "jane-austens-period-drama",
    name: "Jane Austen's Period Drama",
    tagline: null,
    description:
      "England, 1813. In the middle of a long-awaited marriage proposal, Miss Estrogenia Talbot gets her period. Her suitor, Mr. Dickley, mistakes the blood for an injury, and it soon becomes clear that his expensive education has missed a spot.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/5/5/9/6/8/1155968-jane-austens-period-drama-0-230-0-345-crop.jpg?v=74774f0a96",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/jane-austens-period-drama/",
  },
  {
    slug: "the-singers-2025",
    name: "The Singers",
    tagline: "A MAN WALKS INTO A BAR...",
    description:
      "A genre-bending short film inspired by a 19th-century short story written by Ivan Turgenev, in which a lowly pub full of downtrodden men connect unexpectedly through an impromptu sing-off.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/2/0/5/6/7/1320567-the-singers-2025-0-230-0-345-crop.jpg?v=0e06144e42",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/the-singers-2025/",
  },
  {
    slug: "two-people-exchanging-saliva",
    name: "Two People Exchanging Saliva",
    tagline: null,
    description:
      "In a society where kissing is punishable by death, and people pay for things by receiving slaps to the face, Angine, an unhappy woman, shops compulsively in a department store. There, she becomes fascinated by a playful salesgirl. Despite the prohibition of kissing, the two become close, raising the suspicions of a jealous colleague.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/3/3/9/4/4/1233944-two-people-exchanging-saliva-0-230-0-345-crop.jpg?v=7bc27e8793",
    backdrop:
      "https://a.ltrbxd.com/resized/alternative-backdrop/1/2/3/3/9/4/4/tmdb/aqVHksyRLIC2fKGRTvIdsYbWGUd-1200-1200-675-675-crop-000000.jpg?v=724efe2216",
    letterboxd: "https://letterboxd.com/film/two-people-exchanging-saliva/",
  },
  {
    slug: "all-the-empty-rooms",
    name: "All the Empty Rooms",
    tagline: null,
    description:
      "A journalist and a photographer set out to memorialize the bedrooms left behind by children killed in school shootings.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/4/0/0/3/4/0/1400340-all-the-empty-rooms-0-230-0-345-crop.jpg?v=161cce5c40",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/6s/27/o4/w2/gFA4Dn0PJJDXV4XPzO8ZPQLRvvH-1200-1200-675-675-crop-000000.jpg?v=63646fd727",
    letterboxd: "https://letterboxd.com/film/all-the-empty-rooms/",
  },
  {
    slug: "armed-only-with-a-camera-the-life-and-death",
    name: "Armed Only with a Camera: The Life and Death of Brent Renaud",
    tagline: null,
    description: "",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/3/0/2/0/4/0/1302040-armed-only-with-a-camera-the-life-and-death-0-230-0-345-crop.jpg?v=32c4bc6149",
    backdrop: null,
    letterboxd:
      "https://letterboxd.com/film/armed-only-with-a-camera-the-life-and-death/",
  },
  {
    slug: "children-no-more-were-and-are-gone",
    name: "Children No More: Were and Are Gone",
    tagline: null,
    description:
      "In Tel Aviv, activists gather weekly to 'scream' their opposition to the genocidal war in Gaza with a silent vigil for the children killed by Israel. Their protest, consider a betrayal by many, is an act of defiance that calls to confront a reality we must not ignore.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/4/3/3/2/4/5/1433245-children-no-more-were-and-are-gone-0-230-0-345-crop.jpg?v=34beeacc16",
    backdrop: null,
    letterboxd:
      "https://letterboxd.com/film/children-no-more-were-and-are-gone/",
  },
  {
    slug: "the-devil-is-busy",
    name: "The Devil Is Busy",
    tagline: "A DAY ON THE FRONT LINES OF WOMEN'S HEALTHCARE",
    description:
      "At an Atlanta abortion clinic besieged by protesters, the director of operations, Tracy, takes necessary risks to safeguard staff and patients.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/5/9/6/4/0/1259640-the-devil-is-busy-0-230-0-345-crop.jpg?v=cf9955fcc1",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/the-devil-is-busy/",
  },
  {
    slug: "perfectly-a-strangeness",
    name: "Perfectly a Strangeness",
    tagline: null,
    description:
      "In the dazzling incandescence of an unknown desert, three donkeys discover an abandoned astronomical observatory and the universe. A sensorial, cinematic exploration of what a story can be.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/1/6/2/3/3/1/1162331-perfectly-a-strangeness-0-230-0-345-crop.jpg?v=13695dadee",
    backdrop: null,
    letterboxd: "https://letterboxd.com/film/perfectly-a-strangeness/",
  },
];

const receivers = [
  {
    slug: "paul-thomas-anderson",
    name: "Paul Thomas Anderson",
    image: "https://image.tmdb.org/t/p/w500/wKAs2LtLYSUzt3ZZ8pnxMwuEWuR.jpg",
    letterboxd: "https://letterboxd.com/director/paul-thomas-anderson/",
  },
  {
    slug: "ryan-coogler",
    name: "Ryan Coogler",
    image: "https://image.tmdb.org/t/p/w500/dux4DCDaL6c639DTXGiV7nm1wcN.jpg",
    letterboxd: "https://letterboxd.com/director/ryan-coogler/",
  },
  {
    slug: "chloe-zhao",
    name: "Chloé Zhao",
    image: "https://image.tmdb.org/t/p/w500/r8DmTdOqHbDUydCOVb277rncPTK.jpg",
    letterboxd: "https://letterboxd.com/director/chloe-zhao/",
  },
  {
    slug: "joachim-trier",
    name: "Joachim Trier",
    image: "https://image.tmdb.org/t/p/w500/o5KXJRWbzyGYSxDhXsBqbCiZnqU.jpg",
    letterboxd: "https://letterboxd.com/director/joachim-trier/",
  },
  {
    slug: "josh-safdie",
    name: "Josh Safdie",
    image: "https://image.tmdb.org/t/p/w500/iNyilK3Ag6qeOguc0zysxZXEIpJ.jpg",
    letterboxd: "https://letterboxd.com/director/josh-safdie/",
  },
  {
    slug: "jessie-buckley",
    name: "Jessie Buckley",
    image: "https://image.tmdb.org/t/p/w500/i8IlkFbZqKUgkypZKpdhrw00uqw.jpg",
    letterboxd: "https://letterboxd.com/actor/jessie-buckley/",
  },
  {
    slug: "rose-byrne",
    name: "Rose Byrne",
    image: "https://image.tmdb.org/t/p/w500/6YauDiiTBwRGC1xnwspPmNvPWUu.jpg",
    letterboxd: "https://letterboxd.com/actor/rose-byrne/",
  },
  {
    slug: "renate-reinsve",
    name: "Renate Reinsve",
    image: "https://image.tmdb.org/t/p/w500/4MGaghr6uXw6xc2lNCGIYy5aAwE.jpg",
    letterboxd: "https://letterboxd.com/actor/renate-reinsve/",
  },
  {
    slug: "emma-stone",
    name: "Emma Stone",
    image: "https://image.tmdb.org/t/p/w500/cZ8a3QvAnj2cgcgVL6g4XaqPzpL.jpg",
    letterboxd: "https://letterboxd.com/actor/emma-stone/",
  },
  {
    slug: "kate-hudson",
    name: "Kate Hudson",
    image: "https://image.tmdb.org/t/p/w500/s79lH1QzEg2fkXULKBxRmU9aNr8.jpg",
    letterboxd: "https://letterboxd.com/actor/kate-hudson/",
  },
  {
    slug: "timothee-chalamet",
    name: "Timothée Chalamet",
    image: "https://image.tmdb.org/t/p/w500/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg",
    letterboxd: "https://letterboxd.com/actor/timothee-chalamet/",
  },
  {
    slug: "leonardo-dicaprio",
    name: "Leonardo DiCaprio",
    image: "https://image.tmdb.org/t/p/w500/iqPBAdsFdAVCdahQM29kTG6UgD7.jpg",
    letterboxd: "https://letterboxd.com/actor/leonardo-dicaprio/",
  },
  {
    slug: "ethan-hawke",
    name: "Ethan Hawke",
    image: "https://image.tmdb.org/t/p/w500/2LoTr6x0TEM7L5em4kSx1VmGDgG.jpg",
    letterboxd: "https://letterboxd.com/actor/ethan-hawke/",
  },
  {
    slug: "wagner-moura",
    name: "Wagner Moura",
    image: "https://image.tmdb.org/t/p/w500/yJjV1ZCQbCSSgRy05FncCKjyaY4.jpg",
    letterboxd: "https://letterboxd.com/actor/wagner-moura/",
  },
  {
    slug: "michael-b-jordan",
    name: "Michael B. Jordan",
    image: "https://image.tmdb.org/t/p/w500/515xNvaMC6xOEOlo0sFqW69ZqUH.jpg",
    letterboxd: "https://letterboxd.com/actor/michael-b-jordan/",
  },
  {
    slug: "teyana-taylor",
    name: "Teyana Taylor",
    image: "https://image.tmdb.org/t/p/w500/foj8l6GGlZxZXcW6pU5wnNxDjSx.jpg",
    letterboxd: "https://letterboxd.com/actor/teyana-taylor/",
  },
  {
    slug: "amy-madigan",
    name: "Amy Madigan",
    image: "https://image.tmdb.org/t/p/w500/xgtQOuPAmQZXWUO2PXetNpXm08A.jpg",
    letterboxd: "https://letterboxd.com/actor/amy-madigan/",
  },
  {
    slug: "wunmi-mosaku",
    name: "Wunmi Mosaku",
    image: "https://image.tmdb.org/t/p/w500/mWDsVCo9sBcekrsjUTsoCFLhtYt.jpg",
    letterboxd: "https://letterboxd.com/actor/wunmi-mosaku/",
  },
  {
    slug: "inga-ibsdotter-lilleaas",
    name: "Inga Ibsdotter Lilleaas",
    image: "https://image.tmdb.org/t/p/w500/c6JojXrAi9ZAiCA07epc3eLmF1r.jpg",
    letterboxd: "https://letterboxd.com/actor/inga-ibsdotter-lilleaas/",
  },
  {
    slug: "elle-fanning",
    name: "Elle Fanning",
    image: "https://image.tmdb.org/t/p/w500/e8CUyxQSE99y5IOfzSLtHC0B0Ch.jpg",
    letterboxd: "https://letterboxd.com/actor/elle-fanning/",
  },
  {
    slug: "stellan-skarsgard",
    name: "Stellan Skarsgård",
    image: "https://image.tmdb.org/t/p/w500/x78BtYHElirO7Iw8bL4m8CnzRDc.jpg",
    letterboxd: "https://letterboxd.com/actor/stellan-skarsgard/",
  },
  {
    slug: "benicio-del-toro",
    name: "Benicio del Toro",
    image: "https://image.tmdb.org/t/p/w500/aYomJWx0B2B8ra6Rmgt8lr0XCrw.jpg",
    letterboxd: "https://letterboxd.com/actor/benicio-del-toro/",
  },
  {
    slug: "jacob-elordi",
    name: "Jacob Elordi",
    image: "https://image.tmdb.org/t/p/w500/qZNRPWCP2c5d0YaYLTzHXU9Rdoe.jpg",
    letterboxd: "https://letterboxd.com/actor/jacob-elordi/",
  },
  {
    slug: "sean-penn",
    name: "Sean Penn",
    image: "https://image.tmdb.org/t/p/w500/9glqNTVpFpdN1nFklKaHPUyCwR6.jpg",
    letterboxd: "https://letterboxd.com/actor/sean-penn/",
  },
  {
    slug: "delroy-lindo",
    name: "Delroy Lindo",
    image: "https://image.tmdb.org/t/p/w500/kLwUBBmEIdchrLqwsYzgLB2B6q5.jpg",
    letterboxd: "https://letterboxd.com/actor/delroy-lindo/",
  },
  {
    slug: "golden",
    name: "Golden",
  },
  {
    slug: "i-lied-to-you",
    name: "I Lied to You",
  },
  {
    slug: "dear-me",
    name: "Dear Me",
  },
  {
    slug: "train-dreams",
    name: "Train Dreams",
  },
  {
    slug: "sweet-dreams-of-joy",
    name: "Sweet Dreams Of Joy",
  },
];

const nominations = [
  {
    category: "best-picture",
    nominations: [
      { movie: "One Battle After Another", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "Sentimental Value", description: "" },
      { movie: "Frankenstein", description: "" },
      { movie: "Bugonia", description: "" },
      { movie: "Train Dreams", description: "" },
      { movie: "The Secret Agent", description: "" },
      { movie: "F1", description: "" },
    ],
  },
  {
    category: "directing",
    nominations: [
      {
        movie: "One Battle After Another",
        receiver: "Paul Thomas Anderson",
        description: "for",
      },
      { movie: "Sinners", receiver: "Ryan Coogler", description: "for" },
      { movie: "Hamnet", receiver: "Chloé Zhao", description: "for" },
      {
        movie: "Sentimental Value",
        receiver: "Joachim Trier",
        description: "for",
      },
      { movie: "Marty Supreme", receiver: "Josh Safdie", description: "for" },
    ],
  },
  {
    category: "actress-in-a-leading-role",
    nominations: [
      { movie: "Hamnet", receiver: "Jessie Buckley", description: "in" },
      {
        movie: "If I Had Legs I'd Kick You",
        receiver: "Rose Byrne",
        description: "in",
      },
      {
        movie: "Sentimental Value",
        receiver: "Renate Reinsve",
        description: "in",
      },
      { movie: "Bugonia", receiver: "Emma Stone", description: "in" },
      { movie: "Song Sung Blue", receiver: "Kate Hudson", description: "in" },
    ],
  },
  {
    category: "actor-in-a-leading-role",
    nominations: [
      {
        movie: "Marty Supreme",
        receiver: "Timothée Chalamet",
        description: "in",
      },
      {
        movie: "One Battle After Another",
        receiver: "Leonardo DiCaprio",
        description: "in",
      },
      { movie: "Blue Moon", receiver: "Ethan Hawke", description: "in" },
      {
        movie: "The Secret Agent",
        receiver: "Wagner Moura",
        description: "in",
      },
      { movie: "Sinners", receiver: "Michael B. Jordan", description: "in" },
    ],
  },
  {
    category: "actress-in-a-supporting-role",
    nominations: [
      {
        movie: "One Battle After Another",
        receiver: "Teyana Taylor",
        description: "in",
      },
      { movie: "Weapons", receiver: "Amy Madigan", description: "in" },
      { movie: "Sinners", receiver: "Wunmi Mosaku", description: "in" },
      {
        movie: "Sentimental Value",
        receiver: "Inga Ibsdotter Lilleaas",
        description: "in",
      },
      {
        movie: "Sentimental Value",
        receiver: "Elle Fanning",
        description: "in",
      },
    ],
  },
  {
    category: "actor-in-a-supporting-role",
    nominations: [
      {
        movie: "Sentimental Value",
        receiver: "Stellan Skarsgård",
        description: "in",
      },
      {
        movie: "One Battle After Another",
        receiver: "Benicio del Toro",
        description: "in",
      },
      { movie: "Frankenstein", receiver: "Jacob Elordi", description: "in" },
      {
        movie: "One Battle After Another",
        receiver: "Sean Penn",
        description: "in",
      },
      { movie: "Sinners", receiver: "Delroy Lindo", description: "in" },
    ],
  },
  {
    category: "writing-adapted-screenplay",
    nominations: [
      { movie: "One Battle After Another", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "Bugonia", description: "" },
      { movie: "Train Dreams", description: "" },
      { movie: "Frankenstein", description: "" },
    ],
  },
  {
    category: "writing-original-screenplay",
    nominations: [
      { movie: "Sinners", description: "" },
      { movie: "Sentimental Value", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "It Was Just an Accident", description: "" },
      { movie: "Blue Moon", description: "" },
    ],
  },
  {
    category: "casting",
    nominations: [
      { movie: "Sinners", description: "" },
      { movie: "One Battle After Another", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "The Secret Agent", description: "" },
    ],
  },
  {
    category: "cinematography",
    nominations: [
      { movie: "Sinners", description: "" },
      { movie: "One Battle After Another", description: "" },
      { movie: "Train Dreams", description: "" },
      { movie: "Frankenstein", description: "" },
      { movie: "Marty Supreme", description: "" },
    ],
  },
  {
    category: "film-editing",
    nominations: [
      { movie: "One Battle After Another", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "F1", description: "" },
      { movie: "Sentimental Value", description: "" },
    ],
  },
  {
    category: "production-design",
    nominations: [
      { movie: "Frankenstein", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "One Battle After Another", description: "" },
    ],
  },
  {
    category: "costume-design",
    nominations: [
      { movie: "Frankenstein", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "Marty Supreme", description: "" },
      { movie: "Avatar: Fire and Ash", description: "" },
    ],
  },
  {
    category: "makeup-and-hairstyling",
    nominations: [
      { movie: "Frankenstein", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "The Smashing Machine", description: "" },
      { movie: "Kokuho", description: "" },
      { movie: "The Ugly Stepsister", description: "" },
    ],
  },
  {
    category: "sound",
    nominations: [
      { movie: "F1", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "One Battle After Another", description: "" },
      { movie: "Frankenstein", description: "" },
      { movie: "Sirāt", description: "" },
    ],
  },
  {
    category: "visual-effects",
    nominations: [
      { movie: "Avatar: Fire and Ash", description: "" },
      { movie: "F1", description: "" },
      { movie: "Sinners", description: "" },
      { movie: "The Lost Bus", description: "" },
      { movie: "Jurassic World Rebirth", description: "" },
    ],
  },
  {
    category: "music-original-score",
    nominations: [
      { movie: "Sinners", description: "" },
      { movie: "One Battle After Another", description: "" },
      { movie: "Hamnet", description: "" },
      { movie: "Frankenstein", description: "" },
      { movie: "Bugonia", description: "" },
    ],
  },
  {
    category: "music-original-song",
    nominations: [
      { movie: "KPop Demon Hunters", receiver: "Golden", description: "from" },
      { movie: "Sinners", receiver: "I Lied to You", description: "from" },
      {
        movie: "Diane Warren: Relentless",
        receiver: "Dear Me",
        description: "from",
      },
      { movie: "Train Dreams", receiver: "Train Dreams", description: "from" },
      {
        movie: "Viva Verdi!",
        receiver: "Sweet Dreams Of Joy",
        description: "from",
      },
    ],
  },
  {
    category: "animated-feature-film",
    nominations: [
      { movie: "KPop Demon Hunters", description: "" },
      { movie: "Zootopia 2", description: "" },
      { movie: "Arco", description: "" },
      { movie: "Little Amélie or the Character of Rain", description: "" },
      { movie: "Elio", description: "" },
    ],
  },
  {
    category: "international-feature-film",
    nominations: [
      { movie: "Sentimental Value", description: "From Norway" },
      { movie: "The Secret Agent", description: "From Brazil" },
      { movie: "It Was Just an Accident", description: "From France" },
      { movie: "Sirāt", description: "From Spain" },
      { movie: "The Voice of Hind Rajab", description: "From Tunisia" },
    ],
  },
  {
    category: "documentary-feature-film",
    nominations: [
      { movie: "The Perfect Neighbor", description: "" },
      { movie: "The Alabama Solution", description: "" },
      { movie: "Cutting Through Rocks", description: "" },
      { movie: "Mr. Nobody Against Putin", description: "" },
      { movie: "Come See Me in the Good Light", description: "" },
    ],
  },
  {
    category: "animated-short-film",
    nominations: [
      { movie: "Butterfly", description: "" },
      { movie: "The Girl Who Cried Pearls", description: "" },
      { movie: "Retirement Plan", description: "" },
      { movie: "Forevergreen", description: "" },
      { movie: "The Three Sisters", description: "" },
    ],
  },
  {
    category: "live-action-short-film",
    nominations: [
      { movie: "Two People Exchanging Saliva", description: "" },
      { movie: "The Singers", description: "" },
      { movie: "A Friend of Dorothy", description: "" },
      { movie: "Jane Austen's Period Drama", description: "" },
      { movie: "Butcher's Stain", description: "" },
    ],
  },
  {
    category: "documentary-short-film",
    nominations: [
      { movie: "All the Empty Rooms", description: "" },
      {
        movie: "Armed Only with a Camera: The Life and Death of Brent Renaud",
        description: "",
      },
      { movie: "The Devil Is Busy", description: "" },
      { movie: "Perfectly a Strangeness", description: "" },
      { movie: "Children No More: Were and Are Gone", description: "" },
    ],
  },
];

void (async () => {
  // Set all other editions to inactive
  await db
    .update(dbtEdition)
    .set({ isActive: false })
    .where(ne(dbtEdition.year, 2026));

  const [edition] = await db
    .insert(dbtEdition)
    .values({ year: 2026, isActive: true })
    .onConflictDoNothing({ target: dbtEdition.year })
    .returning();

  const editionData =
    edition ??
    (await db.query.dbtEdition.findFirst({
      where: (e, { eq }) => eq(e.year, 2026),
    }));

  if (!editionData) {
    throw new Error("Failed to create or fetch 2026 edition");
  }

  console.log("Edition created/fetched: ", { edition: editionData });

  await db
    .insert(dbtMovie)
    .values(movies.map((m) => ({ ...m, edition: editionData.id })))
    .onConflictDoNothing({ target: dbtMovie.slug });
  console.log("Inserted movies: ", { movies });

  // Insert or update receivers
  for (const receiver of receivers) {
    const existing = await db.query.dbtReceiver.findFirst({
      where: (r, { eq }) => eq(r.slug, receiver.slug),
    });

    if (existing) {
      await db
        .update(dbtReceiver)
        .set({
          name: receiver.name,
          image: receiver.image,
          letterboxd: receiver.letterboxd,
        })
        .where(eq(dbtReceiver.slug, receiver.slug));
    } else {
      await db.insert(dbtReceiver).values(receiver);
    }
  }
  console.log("Inserted/updated receivers: ", { receivers });

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
          edition: editionData.id,
        })
        .onConflictDoNothing();
    }
  }
  console.log("Inserted nominations");
})();

import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-certificate-error')
options.add_argument('--ignore-ssl-errors')
options.add_argument('--allow-insecure-localhost')
options.add_argument('--disable-web-security')
options.add_argument('--start-maximized')
options.add_argument('log-level=3')
options.add_experimental_option("prefs", {
    "download.prompt_for_download": False,
    "plugins.always_open_pdf_externally": True,
    "download.default_directory": "./downloads",
    "directory_upgrade": True,
    "safebrowsing.enabled": True,
    "network": "enable"
})

driver = webdriver.Chrome(options=options)

hrefs = [
    "https://letterboxd.com/film/conclave/",
    "https://letterboxd.com/film/emilia-perez/",
    "https://letterboxd.com/film/anora/",
    "https://letterboxd.com/film/the-brutalist/",
    "https://letterboxd.com/film/wicked-2024/",
    "https://letterboxd.com/film/a-complete-unknown/",
    "https://letterboxd.com/film/dune-part-two/",
    "https://letterboxd.com/film/the-substance/",
    "https://letterboxd.com/film/nickel-boys/",
    "https://letterboxd.com/film/im-still-here-2024/",
    "https://letterboxd.com/film/a-real-pain/",
    "https://letterboxd.com/film/sing-sing-2023/",
    "https://letterboxd.com/film/september-5/",
    "https://letterboxd.com/film/nosferatu-2024/",
    "https://letterboxd.com/film/gladiator-ii/",
    "https://letterboxd.com/film/maria-2024/",
    "https://letterboxd.com/film/the-apprentice-2024/",
    "https://letterboxd.com/film/a-different-man/",
    "https://letterboxd.com/film/the-seed-of-the-sacred-fig/",
    "https://letterboxd.com/film/the-girl-with-the-needle/",
    "https://letterboxd.com/film/the-wild-robot/",
    "https://letterboxd.com/film/alien-romulus/",
    "https://letterboxd.com/film/inside-out-2-2024/",
    "https://letterboxd.com/film/elton-john-never-too-late/",
    "https://letterboxd.com/film/kingdom-of-the-planet-of-the-apes/",
    "https://letterboxd.com/film/better-man-2024/",
    "https://letterboxd.com/film/flow-2024/",
    "https://letterboxd.com/film/wallace-gromit-vengeance-most-fowl/",
    "https://letterboxd.com/film/memoir-of-a-snail/",
    "https://letterboxd.com/film/no-other-land/",
    "https://letterboxd.com/film/sugarcane/",
    "https://letterboxd.com/film/soundtrack-to-a-coup-detat/",
    "https://letterboxd.com/film/black-box-diaries/",
    "https://letterboxd.com/film/porcelain-war/",
    "https://letterboxd.com/film/wander-to-wonder/",
    "https://letterboxd.com/film/in-the-shadow-of-the-cypress/",
    "https://letterboxd.com/film/beautiful-men-2023/",
    "https://letterboxd.com/film/yuck/",
    "https://letterboxd.com/film/magic-candies/",
    "https://letterboxd.com/film/the-man-who-could-not-remain-silent/",
    "https://letterboxd.com/film/anuja/",
    "https://letterboxd.com/film/im-not-a-robot-2023/",
    "https://letterboxd.com/film/a-lien/",
    "https://letterboxd.com/film/crust-2023/",
    "https://letterboxd.com/film/the-last-ranger/",
    "https://letterboxd.com/film/once-upon-a-time-in-ukraine-2024/",
    "https://letterboxd.com/film/makaylas-voice-a-letter-to-the-world/",
    "https://letterboxd.com/film/i-am-ready-warden/",
    "https://letterboxd.com/film/incident-2023/",
    "https://letterboxd.com/film/death-by-numbers/",
    "https://letterboxd.com/film/the-only-girl-in-the-orchestra/",
    "https://letterboxd.com/film/instruments-of-a-beating-heart/",
]


def navigate_to_url(driver, url, retries=3):
    for attempt in range(retries):
        try:
            driver.get(url)
            print(f'Navigated to {url} successfully')
            return
        except Exception as e:
            print(f'Error navigating to {url}: {e}')
            if attempt < retries - 1:
                print('Retrying...')
                time.sleep(2)
            else:
                raise


movies = []
for href in hrefs:
    time.sleep(2)
    navigate_to_url(driver, href)
    time.sleep(2)

    review = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located(
            (By.XPATH, '//div[contains(@class, "review")]'))
    )

    try:
        tagline = review.find_element(
            By.XPATH, '//h4[contains(@class, "tagline")]').text
        print(f'Tagline: {tagline}')
    except Exception as e:
        print(f'Error finding tagline: {e}')
        tagline = None

    description = review.find_element(
        By.XPATH, '//div[contains(@class, "truncate")]/p').text
    print(f'Description: {description}')

    title = driver.find_element(
        By.XPATH, '//h1[contains(@class, "filmtitle")]/span').text
    print(f'Title: {title}')

    try:
        poster = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, '//section[contains(@class, "poster-list")]/a'))
        )
        print(poster.get_attribute('outerHTML'))

        poster_url = poster.get_attribute('href')
        print(f'Poster URL: {poster_url}')
    except Exception as e:
        print(f'Error finding poster URL: {e}')
        poster_url = None

    try:
        backdrop = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, 'backdrop'))
        )
        backdrop_url = backdrop.get_attribute('data-backdrop')
        slug = backdrop.get_attribute('data-film-slug')
    except Exception as e:
        print(f'Error finding backdrop: {e}')
        backdrop_url = None
        slug = href.rstrip('/').split('/')[-1]

    print(f'Backdrop URL: {backdrop_url}')
    print(f'Slug: {slug}')

    movies.append({
        'slug': slug,
        'name': title,
        'tagline': tagline,
        'description': description,
        'poster': poster_url,
        'backdrop': backdrop_url,
        'letterboxd': href,
    })

print(f'{len(movies)} movies found\n\n')
print(movies)

with open('json/movies.json', 'w') as f:
    json.dump(movies, f)

driver.quit()

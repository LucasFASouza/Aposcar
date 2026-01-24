import json
import os
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
    "https://letterboxd.com/film/sinners-2025/",
    "https://letterboxd.com/film/one-battle-after-another/",
    "https://letterboxd.com/film/marty-supreme/",
    "https://letterboxd.com/film/sentimental-value-2025/",
    "https://letterboxd.com/film/hamnet/",
    "https://letterboxd.com/film/frankenstein-2025/",
    "https://letterboxd.com/film/bugonia/",
    "https://letterboxd.com/film/train-dreams/",
    "https://letterboxd.com/film/the-secret-agent-2025/",
    "https://letterboxd.com/film/f1/",
    "https://letterboxd.com/film/blue-moon-2025/",
    "https://letterboxd.com/film/if-i-had-legs-id-kick-you/",
    "https://letterboxd.com/film/song-sung-blue-2025/",
    "https://letterboxd.com/film/weapons-2025/",
    "https://letterboxd.com/film/it-was-just-an-accident/",
    "https://letterboxd.com/film/avatar-fire-and-ash/",
    "https://letterboxd.com/film/sirat-2025/",
    "https://letterboxd.com/film/the-lost-bus/",
    "https://letterboxd.com/film/jurassic-world-rebirth/",
    "https://letterboxd.com/film/the-smashing-machine-2025/",
    "https://letterboxd.com/film/kokuho/",
    "https://letterboxd.com/film/the-ugly-stepsister/",
    "https://letterboxd.com/film/viva-verdi/",
    "https://letterboxd.com/film/diane-warren-relentless/",
    "https://letterboxd.com/film/kpop-demon-hunters/",
    "https://letterboxd.com/film/zootopia-2/",
    "https://letterboxd.com/film/arco/",
    "https://letterboxd.com/film/little-amelie-or-the-character-of-rain/",
    "https://letterboxd.com/film/elio/",
    "https://letterboxd.com/film/the-voice-of-hind-rajab/",
    "https://letterboxd.com/film/the-perfect-neighbour/",
    "https://letterboxd.com/film/the-alabama-solution/",
    "https://letterboxd.com/film/cutting-through-rocks/",
    "https://letterboxd.com/film/mr-nobody-against-putin/",
    "https://letterboxd.com/film/come-see-me-in-the-good-light/",
    "https://letterboxd.com/film/butterfly-2024-1/",
    "https://letterboxd.com/film/forevergreen/",
    "https://letterboxd.com/film/the-girl-who-cried-pearls/",
    "https://letterboxd.com/film/the-three-sisters-2024/",
    "https://letterboxd.com/film/retirement-plan/",
    "https://letterboxd.com/film/butchers-stain/",
    "https://letterboxd.com/film/a-friend-of-dorothy-2025/",
    "https://letterboxd.com/film/jane-austens-period-drama/",
    "https://letterboxd.com/film/the-singers-2025/",
    "https://letterboxd.com/film/two-people-exchanging-saliva/",
    "https://letterboxd.com/film/all-the-empty-rooms/",
    "https://letterboxd.com/film/armed-only-with-a-camera-the-life-and-death/",
    "https://letterboxd.com/film/children-no-more-were-and-are-gone/",
    "https://letterboxd.com/film/the-devil-is-busy/",
    "https://letterboxd.com/film/perfectly-a-strangeness/",
]


# Load existing movies from JSON file
json_file_path = 'json/movies.json'
if os.path.exists(json_file_path):
    with open(json_file_path, 'r') as f:
        movies = json.load(f)
    print(f'Loaded {len(movies)} existing movies')
else:
    movies = []
    print('No existing movies found, starting fresh')


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


for href in hrefs:
    # Extract slug from URL to check if movie already exists
    slug_from_url = href.rstrip('/').split('/')[-1]

    # Check if movie already exists
    if any(movie.get('letterboxd') == href for movie in movies):
        print(f'Movie {slug_from_url} already exists, skipping...')
        continue

    # Close current browser and open a new one
    driver.quit()
    driver = webdriver.Chrome(options=options)

    navigate_to_url(driver, href)

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
        By.XPATH, '//h1[contains(@class, "primaryname")]/span').text
    print(f'Title: {title}')

    try:
        poster = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, '//section[contains(@class, "poster-list")]//div[contains(@class, "film-poster")]/img'))
        )

        print(poster.get_attribute('outerHTML'))

        poster_url = poster.get_attribute('src')
        print(f'Poster URL: {poster_url}')
    except Exception as e:
        print(f'Error finding poster URL: {e}')
        poster_url = None

    try:
        backdrop = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, 'backdrop'))
        )
        backdrop_url = backdrop.get_attribute('data-backdrop')
    except Exception as e:
        print(f'Error finding backdrop: {e}')
        backdrop_url = None

    print(f'Backdrop URL: {backdrop_url}')
    print(f'Slug: {slug_from_url}')

    movie_data = {
        'slug': slug_from_url,
        'name': title,
        'tagline': tagline,
        'description': description,
        'poster': poster_url,
        'backdrop': backdrop_url,
        'letterboxd': href,
    }

    movies.append(movie_data)

    # Save to JSON file immediately after each movie
    os.makedirs('json', exist_ok=True)
    with open(json_file_path, 'w') as f:
        json.dump(movies, f, indent=2)

    print(f'Saved {title} to JSON file')

print(f'\n{len(movies)} total movies in database')
print(movies)

driver.quit()

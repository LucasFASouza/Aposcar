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
    "https://letterboxd.com/actor/brady-corbet/",
]

# Load existing people from JSON file
json_file_path = 'json/people.json'
if os.path.exists(json_file_path):
    try:
        with open(json_file_path, 'r') as f:
            content = f.read()
            if content.strip():  # Check if file is not empty
                people = json.loads(content)
                print(f'Loaded {len(people)} existing people')
            else:
                people = []
                print('JSON file is empty, starting fresh')
    except json.JSONDecodeError as e:
        print(f'Error reading JSON file: {e}')
        print('Starting with empty list')
        people = []
else:
    people = []
    print('No existing people found, starting fresh')


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
    # Extract slug from URL to check if person already exists
    slug_from_url = href.rstrip('/').split('/')[-1]

    # Check if person already exists
    if any(person.get('letterboxd') == href for person in people):
        print(f'Person {slug_from_url} already exists, skipping...')
        continue

    # Close current browser and open a new one
    driver.quit()
    driver = webdriver.Chrome(options=options)

    navigate_to_url(driver, href)
    time.sleep(2)

    header = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located(
            (By.XPATH, '//header[contains(@class, "page-header")]'))
    )

    name = driver.find_element(
        By.XPATH, '//h1[contains(@class, "title-1")]'
    ).text.strip().split('\n')[1]
    print(f'Name: {name}')

    sidebar = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located(
            (By.XPATH, '//aside[contains(@class, "sidebar")]'))
    )

    try:
        image = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, '//div[contains(@class, "image-loaded")]/img'))
        )
        print(image.get_attribute('outerHTML'))

        image_url = image.get_attribute('src')
        print(f'Image URL: {image_url}')
    except Exception as e:
        print(f'Error finding poster URL: {e}')
        image_url = None

    print(f'Slug: {slug_from_url}')

    person_data = {
        'slug': slug_from_url,
        'name': name,
        'image': image_url,
        'letterboxd': href,
    }

    people.append(person_data)

    # Save to JSON file immediately after each person
    os.makedirs('json', exist_ok=True)
    with open(json_file_path, 'w') as f:
        json.dump(people, f, indent=2)

    print(f'Saved {name} to JSON file')

print(f'\n{len(people)} total people in database')
print(people)

driver.quit()

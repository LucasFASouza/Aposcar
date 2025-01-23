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
    "https://letterboxd.com/actor/brady-corbet/",
    "https://letterboxd.com/director/jacques-audiard/",
    "https://letterboxd.com/director/sean-baker/",
    "https://letterboxd.com/director/coralie-fargeat/",
    "https://letterboxd.com/director/james-mangold/",
    "https://letterboxd.com/actor/demi-moore/",
    "https://letterboxd.com/actor/mikey-madison/",
    "https://letterboxd.com/actor/karla-sofia-gascon/",
    "https://letterboxd.com/actor/cynthia-erivo/",
    "https://letterboxd.com/actor/fernanda-torres/",
    "https://letterboxd.com/actor/adrien-brody/",
    "https://letterboxd.com/actor/timothee-chalamet/",
    "https://letterboxd.com/actor/ralph-fiennes/",
    "https://letterboxd.com/actor/colman-domingo/",
    "https://letterboxd.com/actor/sebastian-stan/",
    "https://letterboxd.com/actor/zoe-saldana/",
    "https://letterboxd.com/actor/ariana-grande/",
    "https://letterboxd.com/actor/isabella-rossellini/",
    "https://letterboxd.com/actor/felicity-jones/",
    "https://letterboxd.com/actor/monica-barbaro/",
    "https://letterboxd.com/actor/kieran-culkin/",
    "https://letterboxd.com/actor/edward-norton/",
    "https://letterboxd.com/actor/yura-borisov/",
    "https://letterboxd.com/actor/guy-pearce/",
    "https://letterboxd.com/actor/jeremy-strong/",
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


people = []
for href in hrefs:
    time.sleep(2)
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

    slug = href.rstrip('/').split('/')[-1]

    print(f'Slug: {slug}')

    people.append({
        'slug': slug,
        'name': name,
        'image': image_url,
        'letterboxd': href,
    })

print(f'{len(people)} people found\n\n')
print(people)

with open('json/people.json', 'w') as f:
    json.dump(people, f)

driver.quit()

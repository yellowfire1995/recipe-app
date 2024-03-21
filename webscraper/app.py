from dotenv import load_dotenv
from bs4 import BeautifulSoup
import httpx
from flask import Flask, request, jsonify
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
from flask_cors import CORS, cross_origin
import os


load_dotenv()
app = Flask(__name__)
# CORS(app, resources={r'/api/': {'origins': 'http://localhost:3000'}} )


@app.route("/api/v1/scrape/", methods=['POST'])
def scrape():
    if re.match(".*blueapron.*", request.form['url']):
        print("blueapron")
        return "blueapron"
    elif re.match(".*samsungfood.*", request.form['url']):
        driver = webdriver.Firefox
        driver.get(request.form['url'])
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.s13303")))
        html = driver.page_source
        driver.quit()
        soup = BeautifulSoup(html, "html.parser")
   
        raw_ingredients = soup.find_all(attrs={"data-testid": "recipe-ingredient"})
        
        ingredients = [i.b.string.strip() + " " + i.contents[1].strip() for i in raw_ingredients if i.b]
        for i in raw_ingredients:
            if not i.b:
                ingredients.append(i.text)
        

        raw_instructions = soup.find_all("span", class_="s25 s30 s10189")
        instructions = [{"@type":"HowToStep", "text":re.sub(r'\s+',' ', i.span.string.strip())} for i in raw_instructions]
        recipe = {"@context": "https://schema.org", "@type": ["Recipe"], "recipeIngredient": ingredients, "recipeInstructions": instructions }
        
        return jsonify(recipe)

    else:
        r = httpx.get(request.form['url'])
        html = r.text
        soup = BeautifulSoup(html, 'html.parser')
        raw_recipe = soup.find(type="application/ld+json")
        loaded_recipe = json.loads(raw_recipe.text)
        
        if isinstance(loaded_recipe, list):
            recipe = loaded_recipe[0]
            if recipe['@type'][0] == 'Recipe':
                return recipe
            elif loaded_recipe['@graph']:
                for graph in loaded_recipe['@graph']:
                    if graph['@type'] == 'Recipe':
                        return graph
                    else:
                        continue
        else:
            recipe = loaded_recipe
            if loaded_recipe['@graph']:
                for graph in loaded_recipe['@graph']:
                    if graph['@type'] == 'Recipe':
                        return graph
                    else:
                        continue
              
                
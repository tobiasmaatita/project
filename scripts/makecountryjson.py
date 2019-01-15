#!/usr/bin/env python
# Name: Tobias Maätita
# Student number: 1073019
""" Merge country_names.json and the other .json file. """
import csv
import json
import sys
import numpy as np

country_file = '../data/country_names.json'
education_file = '../data/education_attainment.json'
literacy_file = '..data/literacy_rate_by_country.json'

with open(country_file) as f:
    data_dict = json.loads(country_file)
    print(data_dict)

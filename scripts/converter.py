#!/usr/bin/env python
# Name: Tobias Maätita
# Student number: 1073019
""" Convert .csv files to .json files """
import csv
import json
import sys
import numpy as np

def input_read(input):
    """
    Parse the dataset and store in a dict to read later.
    """

    with open(input, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, delimiter= ";")
        fieldnames = reader.fieldnames
        data_dict = {str(key): "" for key in fieldnames}

        for i, row in enumerate(reader):
            for key in fieldnames:
                # if row[key] == '':
                #     continue
                # else:
                data_dict[key] = row[key]

    return data_dict, fieldnames


def preprocess(data_dict):
    """
    Preprocess data to use in json file, for instance change strings to floats
    or integers for calculations.
    """
    #
    # # literacy_rate_by_country.csv:
    # float_keys = ['Literate world population (people)', 'Illiterate world population (people)']
    # # int_keys = ['Year']
    #
    # # ints:
    # # for key in int_keys:
    # #     data_dict[key] = [int(value) for value in data_dict[key]]
    #
    # # floats:
    # for key in float_keys:
    #     data_dict[key] = [float(value) for value in data_dict[key]]

    return data_dict


def to_json(data_dict, fieldnames, json_file):
    """
    Write the json file.
    """

    with open(json_file, 'w') as f:

        # head = 'Short Name'
        # json_dict = {str(key): "" for key in data_dict[head]}
        json_dict = data_dict

        # for index, country in enumerate(data_dict[head]):
        #     json_dict[country] = data_dict[fieldnames[0]][index]

        f.write(json.dumps(json_dict))

    print(json_dict)
    return True


if __name__ == "__main__":
    input_file = "../data/" + sys.argv[1] + ".csv"
    json_file = "../data/" + sys.argv[1] + ".json"
    dict, fieldnames = input_read(input_file)
    data = preprocess(dict)
    to_json(data, fieldnames, json_file)

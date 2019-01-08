#!/usr/bin/env python
# Name: Tobias Maätita
# Student number: 1073019
""" Convert .csv files to .json files """
import csv
import json
import sys

def input_read(input):
    """
    Parse the dataset and store in a dict to read later.
    """

    with open(input) as f:
        reader = csv.DictReader(f, delimiter=';')
        fieldnames = reader.fieldnames
        data_dict = {str(key): [] for key in fieldnames}

        for i, row in enumerate(reader):
            for key in fieldnames:
                if row[key] == '':
                    continue
                else:
                    data_dict[key].append(row[key])

    return data_dict, fieldnames


def preprocess(data_dict):
    """
    Preprocess data to use in json file, for instance change strings to floats
    or integers for calculations.
    """

    # education_attainment.csv:
    float_keys = ['uneducated', 'primary', 'secondary', 'tertiary',
                  'years of education total', 'years education primary',
                  'years education secondary', 'years education tertiary']

    int_keys = ['population in thousands']

    # ints:
    for key in int_keys:
        data_dict[key] = [int(value) for value in data_dict[key]]

    # floats:
    for key in float_keys:
        data_dict[key] = [float(value.replace(',', '.'))
                          for value in data_dict[key]]

    return data_dict


def to_json(data_dict, fieldnames):
    """
    Write the json file.
    """

    with open('education_attainment.json', 'w') as f:

        head = 'country'
        head_2 = 'year'

        json_dict = {str(key): {str(key_2): {} for key_2 in sorted(set(data_dict[head_2]))}
                     for key in data_dict[head]}
        info_index = 0
        for country_index, key in enumerate(data_dict[head]):
            for year_index, year in enumerate(sorted(set(data_dict[head_2]))):
                for key2 in fieldnames[2:]:
                    json_dict[key][year][key2] = (data_dict[key2][info_index])
                info_index += 1

        # write json
        f.write(json.dumps(json_dict))
    return True


if __name__ == "__main__":
    input_file = sys.argv[1] + ".csv"
    dict, fieldnames = input_read(input_file)
    data = preprocess(dict)
    to_json(data, fieldnames)

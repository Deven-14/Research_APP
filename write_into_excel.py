import xlsxwriter 
import os
from datetime import datetime, timedelta

def get_list(path, sep):
    file1 = open(path, 'r')
    Lines = file1.readlines()
    final_lst = []
    for line in Lines:
        final_lst.append(line.strip().split(sep))
    return final_lst


def get_time_diff(lst):
    final_lst = []
    
    for row in lst:
        sum_of_diff = timedelta(0)
        for i in range(3, len(row)):
            temp1 = row[i-1].replace('.', 'T').replace('Z', 'T').split('T')[:2]
            temp2 = row[i].replace('.', 'T').replace('Z', 'T').split('T')[:2]
            #print(temp1, temp2)
            temp1 = [int(x) for x in temp1[0].split('-') + temp1[1].split(':')]
            temp2 = [int(x) for x in temp2[0].split('-') + temp2[1].split(':')]
            datetime1 = datetime(*temp1)
            datetime2 = datetime(*temp2)
            diff = datetime1 - datetime2
            if(diff.total_seconds() <= 210):
                sum_of_diff += diff
        final_lst.append([row[0], row[1], str(sum_of_diff)] + row[2:])
    
    return final_lst


def write_to_excel(final_lst, path):
    book = xlsxwriter.Workbook(path)     
    sheet = book.add_worksheet()
    if "timestamps" in path:
        final_lst = get_time_diff(final_lst)
    row = 0
    column = 0

    for i in final_lst:
        column = 0
        for j in i:
            sheet.write(row, column, j)     
            column += 1
        row += 1    
     
    book.close()    
    print(final_lst)

def make_dir(directory_name):
    path = os.path.join(os.getcwd(), "DSU_FOP_Data", directory_name)
    if not os.path.exists(path):
        os.mkdir(path)

if __name__ == '__main__':
    lst = ["days", "commits", "timestamps"]
    path1 = 'data_files/classroom_details.txt'
    sep1 = ','
    lst1 = get_list(path1, sep1)
    for k in lst:
        for i in lst1:
            name = i[0]
            if i[1] != 'null':
                name += '_'+i[1]
            try:
                path2 = 'data_files/{}/{}.csv'.format(name, k)
                lst2 = get_list(path2, '**')
                path3 = 'DSU_FOP_Data/{}/{}.xlsx'.format(name, k)
                make_dir(name)
                write_to_excel(lst2, path3)
                #print(path3)
            except:
                print("Exception Occured")
                continue
            else:
                print("Success!")
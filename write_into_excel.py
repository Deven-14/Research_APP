import xlsxwriter 
import os

def get_list(path, sep):
    file1 = open(path, 'r')
    Lines = file1.readlines()
    final_lst = []
    for line in Lines:
        final_lst.append(line.strip().split(sep))
    return final_lst

def write_to_excel(final_lst, path):
    book = xlsxwriter.Workbook(path)     
    sheet = book.add_worksheet()
    row = 0
    column = 0

    for i in final_lst :
        column = 0
        for j in i:
            sheet.write(row, column, j)     
            column += 1
        row += 1    
            
    book.close()    
    print(final_lst)

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
                write_to_excel(lst2, path3)
                #print(path3)
            except:
                continue
            else:
                print("Success!")
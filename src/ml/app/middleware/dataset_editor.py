from services.dataeditor import DataEditorService

class DatasetEditor:

    any_token = '??'
    action_priority = [('del','col'), ('del','nullrows'), ('ins','nullrows'), ('del','duplicates'), ('enc',any_token), ('std',any_token)]

    def sort_actions(actions: list):
        sel = []

        for p in DatasetEditor.action_priority:
            choosen = []
            
            for i in range(len(actions)):
                if p[0] == actions[i]['action'][0] and (p[1] == DatasetEditor.any_token or p[1] == actions[i]['action'][1]):
                    choosen.append(i)
            
            for c in choosen:
                sel.append(actions[c])

            tmp = []
            for i in range(len(actions)):
                if i not in choosen:
                    tmp.append(actions[i])
            actions = tmp

        return sel

    
    def execute(actions: list, data: str):
        actions = DatasetEditor.sort_actions([a for a in actions])

        service = DataEditorService(data)

        for action in actions:
            act = action['action']
            col = action['column']

            # -- Akcije za kolonu --
            if col != '':
                # Delete
                if act[0] == 'del' and act[1] == 'col':
                    print('Delete Column')
                    service.delete_columns([col])

                elif act[0] == 'del' and act[1] == 'nullrows':
                    print('Delete Rows with null')
                    service.delete_rows([col])

                # Insert
                elif act[0] == 'ins' and act[1] == 'nullrows':    
                    print('Insert in Rows with null')
                    
                    if act[2] == 'mean':
                        print('mean')
                        service.fill_na_mean([col])
                    
                    elif act[2] == 'median':
                        print('median')
                        service.fill_na_median([col])

                    elif act[2] == 'cat':
                        print('cat')
                        service.fill_na_categorical([col])
                    
                    else:
                        return None

                # Encode
                elif act[0] == 'enc':
                    print('Encode')
                    
                    if act[1] == 'label':
                        print('label')
                        service.label_encoding([col])
                    
                    elif act[1] == 'onehot':
                        print('onehot')
                        service.one_hot_encoding([col])
                    
                    else:
                        return None

                else:
                    return None

            # -- Globalne akcije --
            elif act[0] == 'del' and act[1] == 'duplicates':
                    print('Delete Duplicates')
                    service.delete_duplicates()
            
            else:
                return None

        return service.csv_result()
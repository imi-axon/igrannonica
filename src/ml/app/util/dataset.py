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

            for c in choosen:
                actions.pop(c)

        return sel

    
    def execute(actions: list, data: str):
        actions = DatasetEditor.sort_actions([a for a in actions])

        for action in actions:
            act = action['action']
            col = action['column']

            # -- Akcije za kolonu --
            if col != '':
                # Delete
                if act[0] == 'del' and act[1] == 'col':
                    print('Delete Column')

                elif act[0] == 'del' and act[1] == 'nullrows':
                    print('Delete Rows with null')

                # Insert
                elif act[0] == 'ins' and act[1] == 'nullrows':    
                    print('Insert in Rows with null')

                # Encode
                elif act[0] == 'enc':
                    print('Encode')

                else:
                    return ('Komanda ' + act[0] + ' nepoznata', 500)

            # -- Globalne akcije --
            else:
                if act[0] == 'del' and act[1] == 'duplicates':
                    print('Delete Duplicates')

                elif act[0] == 'std':
                    print('Delete Duplicates')
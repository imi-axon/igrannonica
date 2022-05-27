export class DataConverter 
{
    static metaToHeaders(meta: DatasetMetadata):TopLevelHeaders
    {
        let headers: TopLevelHeaders = { 
            num: [],
            cat: [],
            onehot: {},
            label: []
        }

        for (const key in meta.columns) {
            if (Object.prototype.hasOwnProperty.call(meta.columns, key)) {
                const colname = key;
                const col = meta.columns[key];
                if (col.type == "num") 
                    headers.num.push(colname)

                else if (col.type == "cat")
                    headers.cat.push(colname)
                
                else if (col.type == "enc" && col.encoding) 
                {
                    if (col.encoding.type == "onehot" && col.encoding.onehot) {
                        let h = col.encoding.onehot.originalHeader
                        if (headers.onehot[h] == undefined)
                            headers.onehot[h] = []
                        headers.onehot[h].push({ header:  colname, value: col.encoding.onehot.catValue })
                    }

                    else if (col.encoding.type == "label" && col.encoding.label) {
                        let mp: { catVal: string, numVal: number }[] = []
                        for (const m of col.encoding.label.valueMappings)
                            mp.push({ catVal: m.original, numVal: m.new})
                        headers.label.push({ name: colname, mappings: mp})
                    }
                }
            }
        }


        return headers
    }
}

export interface TopLevelHeaders
{
    num: string[]
    cat: string[]
    onehot: { [name: string] : { header: string, value: string }[] }
    label: {
        name: string, 
        mappings: { catVal: string, numVal: number }[]
    }[]
}

// -- Metadata Types --

export interface DatasetMetadata
{
    columns: Header[]
    statistics: string              // statistika u JSON formatu (definisan na Figmi)
}

export interface Header 
{
    name: string                    // naziv kolone
    type: "num" | "cat" | "enc"     // tip kolone (numericka, kategorijska, enkodirana-numericka)
    trainReady: boolean             // da li je spreman za treniranje
    encoding: Encoding | null       // podaci o enkodiranju kolone (nije None ukoliko je type = "enc")
}

export interface Encoding
{
    type: "onehot" | "label"        // tip enkodiranja koji je primenjen
    onehot: OneHotEncData | null           // nije None ukoliko je type = "onehot"
    label: LabelEncData | null             // nije None ukoliko je type = "label"
}

export interface OneHotEncData
{
    originalHeader: string          // naziv originalne kolone
    catValue: string                // kategorijska vrednost koju kolona predstavlja
}

export interface LabelEncData
{
    valueMappings: LabelEncMapping[]      // niz mapiranja starih u nove vrednosti
}

export interface LabelEncMapping
{
    original: string                // originalna vrednost (kategorijska)
    new: number                     // enkodirana vrednost (numericka)
}

const Translator = {
   wareframe,
};

function wareframe(model) {
   const 
      verticesDict = {},
      orderedArray = [],
      modelArray = model.split(' '),
      verticesCount = modelArray.pop(),
      verticesArray = modelArray.splice(0, verticesCount),
      pointersArray = modelArray;

   if (verticesCount == '*') return modelArray;

   for (let i = 1, c = 0; i < verticesCount; i++, c+=3)
      verticesDict[i] = [
                           verticesArray[c], 
                           verticesArray[c + 1], 
                           verticesArray[c + 2]
                        ];

   for (let i = 0; i < pointersArray.length; i++)
      orderedArray.push(verticesDict[pointersArray[i]]);

   return new Float32Array(orderedArray.flat());
};

export default Translator;

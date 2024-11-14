async function img (){
const url = 'https://api.edenai.run/v2/image/generation';
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTNmMDI2YzEtMWE1OS00NTczLWIyNTAtNDA1ZWVlMzlhMWQwIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.Afcxy428iDJI2UqH5Fj9YczD_zNaA85CM5s_NFYm1ls'
  },
  body: JSON.stringify({
    response_as_dict: true,
    attributes_as_list: false,
    show_base_64: false,
    show_original_response: false,
    num_images: 1,
    providers: ['amazon/titan-image-generator-v1_standard'],
    text: 'man on SKY',
    resolution: '512x512'
  })
};

  const data = await fetch(url, options)
  let tempo =await data.json()
  console.log(tempo['amazon/titan-image-generator-v1_standard'].items[0])
}
img()
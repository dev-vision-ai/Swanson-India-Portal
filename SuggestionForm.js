document.getElementById('suggestionForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const formData=new FormData(e.target);
    const files=document.getElementById('attachments').files;
    const isAnonymous=document.getElementById('anonymousCheckbox').checked;
    if(isAnonymous){formData.delete('employeeName')}
    for(let i=0;i<files.length;i++){formData.append('attachments',files[i])}
    try{
        await new Promise(resolve=>setTimeout(resolve,1000));
        document.querySelector('.submission-success').classList.add('show');
        e.target.reset();
        document.getElementById('fileList').innerHTML='';
        setTimeout(()=>{document.querySelector('.submission-success').classList.remove('show')},3000)
    }catch(error){console.error('Submission error:',error)}
});
document.getElementById('attachments').addEventListener('change',(e)=>{
    const fileList=document.getElementById('fileList');
    fileList.innerHTML='';
    Array.from(e.target.files).forEach(file=>{
        const fileItem=document.createElement('div');
        fileItem.className='file-item';
        fileItem.innerHTML=`<i class="fas fa-file-alt"></i><span>${file.name}</span><small>(${(file.size/1024).toFixed(1)}KB)</small>`;
        fileList.appendChild(fileItem)
    })
});
document.addEventListener('DOMContentLoaded',function(){
    const improvementType=document.getElementById('improvementType');
    const otherDescriptionGroup=document.getElementById('otherDescriptionGroup');
    improvementType.addEventListener('change',function(){
        if(this.value==='other'){otherDescriptionGroup.style.display='block'}
        else{otherDescriptionGroup.style.display='none'}
    })
});
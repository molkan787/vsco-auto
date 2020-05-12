import { spawn }  from 'child_process';

export async function addPathItem(item){
    try {
        const current_value = process.env.PATH;
        const new_path_value = current_value.concat(";", item);
        await exec('setx', ['PATH', `"${new_path_value}"`]);
    } catch (error) {
        console.error('addPathItem() Error');
        console.error(error);
        throw new Error('Failed to add item to PATH environement varialble');
    }
}

function exec(cmd, args){
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args);
        proc.on('close', resolve);
        proc.on('error', reject);
    })
}

window.addPathItem = addPathItem;
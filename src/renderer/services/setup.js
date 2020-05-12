import { setupDependecies } from './android-app';

window.androidSetupDependecies = setupDependecies;

export default async function setup(){
    await setupDependecies();
}
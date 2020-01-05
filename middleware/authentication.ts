export default function({ store, redirect }) {
  if (!localStorage.getItem('auth')) {
   return redirect('/auth')
  }
}

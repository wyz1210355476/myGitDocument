export default {
	props: ['visibility'],
	computed: {
		visible: {
			get() {
				return this.visibility;
			},
			set(v) {
				this.$emit("update:visibility", v);
			}
		}
	},
}
<template>
    <div class="bg-gradient-to-b from-white to-blue-50 shadow-xl rounded-3xl p-10 max-w-6xl mx-auto mt-24 mb-16">
        <h1 class="text-5xl font-bold text-blue-800 mb-8 border-b-2 border-blue-200 pb-3">
            Contact Us
        </h1>

        <p class="mb-10 text-gray-700 text-lg leading-relaxed">
            Whether you're a customer, partner, or someone interested in learning more about Minstiss — we’re here to
            help. Don’t hesitate to get in touch.
        </p>

        <div class="grid md:grid-cols-2 gap-10 text-gray-800 text-base">
            <!-- Address -->
            <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
                <h2 class="text-xl font-semibold text-blue-700 mb-2">Address</h2>
                <p>
                    Minstiss Headquarters<br />
                    Mangal Murti Apartment, near Gajera School, Katargam<br />
                    Surat – 395004, Gujarat
                </p>
            </div>

            <!-- Phone -->
            <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
                <h2 class="text-xl font-semibold text-blue-700 mb-2">Phone</h2>
                <p>
                    Customer Support: <span class="font-medium">+91-9909347479</span><br />
                    Hours: Mon – Sat, 10:00 AM – 6:00 PM
                </p>
            </div>

            <!-- Email -->
            <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
                <h2 class="text-xl font-semibold text-blue-700 mb-2">Email</h2>
                <p>
                    General: <a href="mailto:support@minstiss.com"
                        class="text-blue-600 hover:underline">support@minstiss.com</a><br />
                    Partnerships: <a href="mailto:business@minstiss.com"
                        class="text-blue-600 hover:underline">business@minstiss.com</a>
                </p>
            </div>

            <!-- Social Media -->
            <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
                <h2 class="text-xl font-semibold text-blue-700 mb-2">Social Media</h2>
                <p>
                    Instagram: <a href="#" class="text-blue-600 hover:underline">@minstiss</a><br />
                    Facebook: <a href="#" class="text-blue-600 hover:underline">Minstiss Official</a><br />
                    Twitter: <a href="#" class="text-blue-600 hover:underline">@minstiss_store</a>
                </p>
            </div>
        </div>

        <div class="mt-12 bg-white border-l-4 border-blue-600 rounded-xl p-8 shadow-md">
            <h2 class="text-2xl font-semibold text-blue-800 mb-3">Join Our Growth Journey</h2>
            <p class="text-gray-700 leading-relaxed">
                If you’re looking to become a seller or delivery partner, we’d love to connect. Let’s grow together —
                drop us an email and our team will reach out promptly.
            </p>
        </div>
    </div>
    <!-- Embedded Google Map -->
    <div class="w-full mt-16">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0468785849425!2d72.83641307508672!3d21.229989580470157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ec4a5f635af%3A0x854204ff92de9bf7!2sMangal%20Murti%20Apartment%2C%20Amroli%20Rd%2C%20near%20Ashish%20Restaurant%2C%20New%20GIDC%2C%20Divyajyot%20Society%2C%20Patel%20Nagar%2C%20Surat%2C%20Gujarat%20395004!5e0!3m2!1sen!2sin!4v1749233699722!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

</template>

<script>
export default {
    name: 'UserContact'
}
</script>

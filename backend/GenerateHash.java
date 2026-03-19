import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("Hash para 'admin123': " + encoder.encode("admin123"));
        System.out.println("Hash para 'password': " + encoder.encode("password"));
        System.out.println("Hash para 'admin': " + encoder.encode("admin"));
    }
}
